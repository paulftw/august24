import React, { Component } from 'react'

import firebase from './firebase'
import appRouter from './ui/AppRouter'

export default class AppRoot extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.router = appRouter(this)
  }

  componentDidMount() {
    this._ismounted = true

    firebase.addAuthListener(user => {
      if (user) {
        // User is signed in.
        this.router.navigate('Conversations')
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
