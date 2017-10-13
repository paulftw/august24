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
    return await firebase.signOut()
  }

  componentDidMount() {
    this._ismounted = true

    firebase.addAuthListener(user => {
      if (user) {
        // User is signed in.
        this.router.navigate('Conversations')

        this.setState({
          contacts: [
            {
              name: 'Ігор Єрьомін',
              uid: 'foo',
              isRegistered: true,
            },
            {
              name: 'Павло Коржик',
              uid: 'bar',
              isRegistered: true,
            },
          ],
        })

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
