import React, { Component } from 'react'
import {
  AppRegistry,
  NativeModules,
} from 'react-native'

import firebase from './firebase'
const firedb = firebase.firedb

import HomeLoggedIn from './ui/HomeLoggedIn'
import LoadingScreen from './ui/LoadingScreen'
import StartOnboarding from './ui/StartOnboarding'
import Router from './ui/Router'

class August24 extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.router = new Router(this, {
      routes: {
        'HomeLoggedIn': routeParams => <HomeLoggedIn />,
        'LoadingScreen': routeParams => <LoadingScreen />,
        'StartOnboarding': routeParams => <StartOnboarding
            signIn={e => this.signIn()}
          />,
      },
      initialRoute: 'LoadingScreen',
    })
  }

  async signIn() {
    try {
      const user = await NativeModules.RNFirebaseUI.showLogin()
      user = await firebase.auth().getCurrentUser()
      this.setState({
        user
      })
      this.router.navigate('HomeLoggedIn')
    } catch (err) {
      // TODO: error reporting
      // err.nativeStackIOS = null
      alert('Нажаль Вас не було авторизовано.\n' + JSON.stringify(err).substring(100))
    }
  }

  componentDidMount() {
    this._ismounted = true

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.setState({user})
        this.router.navigate('HomeLoggedIn')
        firedb.ref(`/users/${user.uid}/dataField`).set('set by the app')
        firedb.ref(`/users/${user.uid}/phoneNumber`).set('x-x-x-x')
      } else {
        this.router.navigate('StartOnboarding')
      }
    })
  }

  componentWillUnmount() {
    this._ismounted = false
  }

  isMounted() {
    return !!this._ismounted
  }

  render() {
    return this.router.render()
  }
}

AppRegistry.registerComponent('August24', () => August24)
