import EventEmitter from 'EventEmitter'
import { NativeModules, Platform, } from 'react-native'
import Firebase from 'react-native-firebase'

import Enum from './Enum'
import * as Debug from './debugtools'
import DataModel from './DataModel'

const NetworkState = Enum('Offline', 'Online')
const AuthState = Enum('Unknown', 'SignedIn', 'NotSignedIn')

const AUTH_EVENT_NAME = 'auth_state_changed'

const URL_API_SERVER = 'https://us-central1-sizzling-torch-7444.cloudfunctions.net/'

class FirebaseController {
  constructor() {
    this.firebase = Firebase.app()
    this.firedb = this.firebase.database()
    this.emitter = new EventEmitter()

    this.networkStatus = NetworkState.Online
    this.authStatus = AuthState.Unknown

    this.AuthStates = AuthState

    this.firebase.auth().onAuthStateChanged(user => this.onAuthStateChanged(user))
  }

  addAuthListener(fn) {
    const subscription = this.emitter.addListener(AUTH_EVENT_NAME, fn)
    if (this.authStatus !== AuthState.Unknown) {
      fn({user: this.authUser, previousState: AuthState.Unknown, })
    }

    return subscription
  }

  removeAuthListener(subscription) {
    return this.emitter.removeSubscription(subscription)
  }

  async onAuthStateChanged(user) {
    const previousState = this.authStatus
    this.authStatus = user ? AuthState.SignedIn : AuthState.NotSignedIn

    this.authUser = user
    if (user) {
      this.authUserToken = await user.getIdToken()
      this.firedb.ref(`/users/${user.uid}/publicProfile/lastLogin`).set(Date.now())
    }
    this.emitter.emit(AUTH_EVENT_NAME, { user, previousState, })
  }

  getCurrentUser() {
    return this.authUser
  }

  getDataModel() {
    // TODO this is a terrible hack - no smart cleanup when user logs out
    return new DataModel(this.firedb, this.authUser)
  }

  async startAuth() {
    Debug.log('entered startAuth')
    try {
      let uiResult = null
      if (Platform.OS === 'ios') {
        uiResult = await NativeModules.RNFirebaseUI.showLogin()
      } else if (Platform.OS === 'android') {
        NativeModules.RNFirebaseUIAuthPhoneExample.show()
      } else {
        alert('OMG як ви попали на платформу ' + Platform.OS)
        return null
      }
      Debug.log('uiResult = ', uiResult)
      return await this.firebase.auth().getCurrentUser()
    } catch (err) {
      // TODO: error reporting
      // err.nativeStackIOS = null
      // alert('Нажаль Вас не було авторизовано.\n' + JSON.stringify(err).substring(100))
      Debug.log('error ', err)
      return false
    }
  }

  async signInDebugUser() {
    if (!Debug.DEBUG) {
      return await this.startAuth()
    }
    return await this.firebase.auth().signInAnonymously()
  }

  signOut() {
    return this.firebase.auth().signOut()
  }

  async rpc(route, params) {
    const response = await fetch(URL_API_SERVER + route, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Authorization': 'Bearer ' + this.authUserToken,
        'Content-Type': 'application/json',
      },
    })
    // TODO when rpc fails this throws a JSON parse error, should fail gracefully
    return await response.json()
  }
}

const firebaseController = new FirebaseController()

export default firebaseController
