import { NativeModules, Platform, } from 'react-native'
import Firebase from 'react-native-firebase'
import { BehaviorSubject, Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'

import Enum from './Enum'
import * as Debug from './debugtools'
import DataModel from './DataModel'

const NetworkState = Enum('Offline', 'Online')
const AuthState = Enum('Unknown', 'SignedIn', 'NotSignedIn')

const URL_API_SERVER = 'https://us-central1-sizzling-torch-7444.cloudfunctions.net/'

class FirebaseController {
  constructor() {
    this.firebase = Firebase.app()
    this.firedb = this.firebase.database()

    this.authStateSubject = new BehaviorSubject({
      user: null,
      previousState: AuthState.Unknown,
    })

    this.networkStatus = NetworkState.Online
    this.authStatus = AuthState.Unknown

    this.AuthStates = AuthState

    this.firebase.auth().onAuthStateChanged(user => this.onAuthStateChanged(user))
  }

  addAuthListener(next) {
    return this.authStateSubject.subscribe({next})
  }

  removeAuthListener(subscription) {
    return subscription.unsubscribe()
  }

  async onAuthStateChanged(user) {
    const previousState = this.authStatus
    this.authStatus = user ? AuthState.SignedIn : AuthState.NotSignedIn
    this.authUser = user
    if (user) {
      this.authUserToken = await user.getIdToken()
      this.firedb.ref(`/users/${user.uid}/publicProfile/lastLogin`).set(Date.now())
    }
    this.authStateSubject.next({ user, previousState, })
  }

  getCurrentUser() {
    return this.authUser
  }

  async startAuth() {
    Debug.log('entered startAuth')
    try {
      let uiResult = null
      if (Platform.OS === 'ios') {
        uiResult = await NativeModules.RNFirebaseUI.showLogin(true)
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

  async userNameExists() {
    const publicProfile = await this.firedb.ref(`/users/${this.authUser.uid}/publicProfile`).once('value')
    const val = publicProfile.val()
    return  !!(val && val.userName)
  }

  async saveUserName(userName) {
    this.firedb.ref(`/users/${this.authUser.uid}/publicProfile/userName`).set(userName)
  }

  async getUserName() {
    const res = await this.firedb.ref(`/users/${this.authUser.uid}/publicProfile/userName`).once()
    return res.val()
  }

  getOtherUserId(directChatKey) {
    const me = this.authUser.uid
    if (directChatKey.endsWith(`-${me}`)) {
      return directChatKey.substring(0, directChatKey.length - me.length - 1)
    }
    if (directChatKey.startsWith(`${me}-`)) {
      return directChatKey.substring(me.length + 1)
    }
    throw new Error('This is not a direct chat ' + directChatKey)
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

  getRef(path) {
    return this.firedb.ref(path)
  }

  getObservableRef(path, options) {
    options = options || {}
    return Observable.create(observer => {
      let fireRef = this.firedb.ref(path)
      if (options.orderByChild) {
        fireRef = fireRef.orderByChild(options.orderByChild)
      }
      const fireSubscription = fireRef.on('value', observer.next.bind(observer))

      return function unsubscribe() {
        fireRef.off('value', fireSubscription)
      }
    })
  }
}

const firebaseController = new FirebaseController()

export function snapshotToList(snap) {
  const res = []
  snap.forEach(child => {
    res.push([child.key, child.val()])
  })
  return res
}


export default firebaseController
