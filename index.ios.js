import React, { Component } from 'react'
import {
  AppRegistry,
} from 'react-native'
import codePush from "react-native-code-push"

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
      <HomeLoggedOut meta={codePush.getUpdateMetadata()} />
    );
  }
}

August24 = codePush({
  checkFrequency: codePush.CheckFrequency.MANUAL,
})(August24)

setInterval(() => codePush.sync({
    updateDialog: false,
    installMode: codePush.InstallMode.IMMEDIATE
  }), 10000)

AppRegistry.registerComponent('August24', () => August24)
