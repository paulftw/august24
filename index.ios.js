import React, { Component } from 'react'
import {
  AppRegistry,
} from 'react-native'

import HomeLoggedOut from './ui/HomeLoggedOut'

class August24 extends Component {
  componentDidMount() {
    // firedb.ref('/foo').on('value', snap => {
    //   this.setState({ foo: snap.val() })
    // })
    // firedb.ref('.info/connected').on('value', snap => {
    //   this.setState({ connected: snap.val() })
    // })
  }

  render() {
    return (
      <HomeLoggedOut />
    );
  }
}

AppRegistry.registerComponent('August24', () => August24)
