import React, { Component } from 'react'

import firebase from './firebase'
import appRouter from './ui/AppRouter'

export default class AppRoot extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.router = appRouter(this)
  }

  async onLogout() {
    const logoutResult = await firebase.signOut()
    this.router.navigate('OnboardingStart')
    return logoutResult
  }

  async onLoginStatusChanged({ user, previousState, }) {
    // Firebase may or may not start before the root component is mounted.
    if (previousState !== firebase.AuthStates.Unknown) {
      // Ignore all transitions after the initial load.
      return
    }

    // HACK: Ensures AppRoot is re-rendered on any auth change
    this.setState({user})

    if (user) {
      const userNameExists = await firebase.userNameExists()
      if (!userNameExists) {
        this.router.navigate('OnboardingAskName')
      } else {
        this.router.navigate('Conversations')
      }
    } else {
      this.router.navigate('OnboardingStart')
    }
  }

  componentDidMount() {
    this._ismounted = true
    firebase.addAuthListener(data => this.onLoginStatusChanged(data))
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
