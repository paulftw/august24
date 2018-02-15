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

import { DEBUG } from '../debugtools'
import * as Debug from '../debugtools'

export default class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  onLogout() {
    this.props.onLogout ? this.props.onLogout() : alert('Нажаль ліниві програмісти не реалізували цю кнопку')
  }

  componentDidMount() {
    this.authSubscription = firebase.addAuthListener(({user, previousState}) => {
      this.setState({ user: firebase.authUser })
    })
  }
  componentWillUnmount() {
    firebase.removeAuthListener(this.authSubscription)
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

          {!DEBUG ? null :
            <View>
              <TouchableOpacity
                  onPress={e => Debug.performDebugRpc()}
                  >
                <Button label='Debug' />
              </TouchableOpacity>

              <TouchableOpacity
                  onPress={e => this.props.onOpenAllowContacts()}
                  >
                <Button label='Debug Onboarding' />
              </TouchableOpacity>

              <Text>user: {this.state.user ? Debug.jsonShort(this.state.user.toJSON()) : 'null?'}{'\n'}token: {`${(firebase.authUserToken || '').substring(0, 32)}...`}</Text>
            </View>
          }

        </ScrollView>

        {this.props.bottomNav.render()}
      </Screen>
    )
  }
}
