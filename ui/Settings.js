import React, { Component } from 'react'
import {
  ScrollView,
  TouchableOpacity,
} from 'react-native'

import firebase from '../firebase'

import {
  centerVertical,
  floatRight,
  Button,
  Hero,
  HighlightRow,
  Icon,
  Label,
  Panel,
  Screen,
  SectionHeader,
  Text,
  Title,
  View,
} from '../trvl'

export default class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  onLogout() {
    this.props.onLogout ? this.props.onLogout() : alert('Нажаль ліниві програмісти не реалізували цю кнопку')
  }

  async onDebug() {
    const resp = await firebase.rpc('debugEcho', {a: 300, x: 16, })
    alert('echo Resp ' + JSON.stringify(resp))
  }

  componentDidMount() {
    this.authSubscription = firebase.addAuthListener(({user, previousState}) => {
      this.setState({ user: firebase.authUser })
    })
  }
  componentWillUnmount() {
    firebase.removeAuthListener(this.authSubscription)
  }

  displayUser(user) {
    const fields = Object.keys(user).map(k => {
      const val = typeof user[k] === 'string' ? '' + user[k] : (JSON.stringify(user[k]) || 'undefined')
      `  ${k}: ${val.length <= 32 ? val : val.substring(0, 30) + '...'}`
    })
    return ['{', ...fields, '}'].join('\n')
  }

  render() {
    return (
      <Screen>
        <Hero backgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Title>Налаштування</Hero.Title>
        </Hero>

        <ScrollView>
          <TouchableOpacity
              onPress={e => this.onLogout()}
              >
            <Button label='Вийти з програми' />
          </TouchableOpacity>

          <TouchableOpacity
              onPress={e => this.onDebug()}
              >
            <Button label='Debug' />
          </TouchableOpacity>

          <View>
            <Text>user: {this.state.user ? this.displayUser(this.state.user.toJSON()) : 'null?'}{'\n'}token: {`${(firebase.authUserToken || '').substring(0, 32)}...`}</Text>
          </View>
        </ScrollView>

        {this.props.bottomNav.render()}
      </Screen>
    )
  }
}
