import {
  LoginButton,
  AccessToken
} from 'react-native-fbsdk'
import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native'

import Firebase from 'react-native-firebase'

const firebase = Firebase.initializeApp({
  persistence: true,
})

export default class August24 extends Component {
  constructor(props) {
    super(props)
    this.state = { foo: 'no foo yet' }
  }

  componentDidMount() {
    firebase.database().ref('/foo').on('value', snap => {
      this.setState({ foo: snap.val() })
    })
    firebase.database().ref('.info/connected').on('value', snap => {
      this.setState({ connected: snap.val() })
    })
  }

  onLoginFinished(error, result) {
    if (error) {
      alert("login has error: " + result.error)
    } else if (result.isCancelled) {
      alert("login is cancelled.")
    } else {
      AccessToken.getCurrentAccessToken().then(
        data => alert(data.accessToken.toString())
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Слава Україні!
        </Text>
        <Text style={styles.instructions}>
          Codename August24
        </Text>
        <Text style={styles.instructions}>
          'foo' => {this.state.foo}{'\n'}
          'connected' => {this.state.connected}
        </Text>

        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={this.onLoginFinished.bind(this)}
          onLogoutFinished={() => alert("logout.")}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('August24', () => August24);
