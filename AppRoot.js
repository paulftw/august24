import React, { Component } from 'react'

import firebase from './firebase'
import appRouter from './ui/AppRouter'

export default class AppRoot extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.router = appRouter(this)

    this.dataModel = firebase.getDataModel()
    this.state.conversations = this.dataModel.getConversations()
    this.state.contacts = this.dataModel.getContacts()
  }

  async onLogout() {
    const logoutResult = await firebase.signOut()
    this.router.navigate('OnboardingStart')
    return logoutResult
  }

  subToMessages(roomId, cb) {
    // TODO: unsubscribe when necessary somehow
    this.dataModel.subToMessages(roomId, cb)
  }

  componentDidMount() {
    this._ismounted = true

    firebase.addAuthListener(({ user, previousState, }) => {
      // Firebase may or may not start before the root component is mounted.
      if (previousState !== firebase.AuthStates.Unknown) {
        // Ignore all transitions after the initial load.
        return
      }

      this.dataModel = firebase.getDataModel()

      if (user) {
        // TODO: unsubscribe previous listener, if any
        this.dataModel.onConversations(conversations => {
          this.setState({
            conversations,
          })
        })

        this.router.navigate('Conversations')
      } else {
        this.router.navigate('OnboardingStart')
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
