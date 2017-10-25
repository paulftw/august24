import EventEmitter from 'EventEmitter'
import { NativeModules, Platform, } from 'react-native'
import Firebase from 'react-native-firebase'

import Enum from './Enum'

const NetworkState = Enum('Offline', 'Online')
const AuthState = Enum('Unknown', 'SignedIn', 'NotSignedIn')

const AUTH_EVENT_NAME = 'auth_state_changed'

const URL_API_SERVER = 'https://us-central1-sizzling-torch-7444.cloudfunctions.net/'

// WARNING: when disabling this you SHOULD also turn off anonymous sign in in the Firebase console
const ALLOW_DEBUG_SIGN_IN = true

class FirebaseController {
  constructor() {
    this.firebase = Firebase.initializeApp({
      persistence: true,
    })
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

  async startAuth() {
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
      user = await this.firebase.auth().getCurrentUser()
      this.setState({ user })
      return true
    } catch (err) {
      // TODO: error reporting
      // err.nativeStackIOS = null
      // alert('Нажаль Вас не було авторизовано.\n' + JSON.stringify(err).substring(100))
      return false
    }
  }

  async signInDebugUser() {
    if (!ALLOW_DEBUG_SIGN_IN) {
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
    return await response.json()
  }
}

const firebaseController = new FirebaseController()

export default firebaseController
