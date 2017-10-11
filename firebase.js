import EventEmitter from 'EventEmitter'
import Firebase from 'react-native-firebase'

import Enum from './Enum'

const NetworkState = Enum('Offline', 'Online')
const AuthState = Enum('Unknown', 'SignedIn', 'NotSignedIn')

const AUTH_EVENT_NAME = 'auth_state_changed'

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
    this.emitter.emit(AUTH_EVENT_NAME, user)
  }

  getCurrentUser() {
    return this.authUser
  }
}

const firebaseController = new FirebaseController()

export default firebaseController
