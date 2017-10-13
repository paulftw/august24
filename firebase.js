import EventEmitter from 'EventEmitter'
import { NativeModules, Platform, } from 'react-native'
import Firebase from 'react-native-firebase'

import Enum from './Enum'

const NetworkState = Enum('Offline', 'Online')
const AuthState = Enum('Unknown', 'SignedIn', 'NotSignedIn')

const AUTH_EVENT_NAME = 'auth_state_changed'

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

    this.firebase.auth().onAuthStateChanged(user => this.onAuthStateChanged(user))
  }

  addAuthListener(fn) {
    this.emitter.addListener(AUTH_EVENT_NAME, fn)
    this.emitter.emit(AUTH_EVENT_NAME, this.authUser)
  }

  onAuthStateChanged(user) {
    this.authStatus = user ? AuthState.SignedIn : AuthState.NotSignedIn
    this.authUser = user
    if (user) {
      this.firedb.ref(`/users/${user.uid}/lastLogin`).set(Date.now())
    }
    this.emitter.emit(AUTH_EVENT_NAME, user)
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
}

const firebaseController = new FirebaseController()

export default firebaseController
