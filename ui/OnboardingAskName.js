import React, { Component } from 'react'

import firebase from '../firebase'

import {
  Button,
  Hero,
  Screen,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '../trvl'

export default class OnboardingAskName extends Component {

  async onStartAuth(debug) {
    const result = debug ? await firebase.signInDebugUser() : await firebase.startAuth()
    if (result) {
      this.props.onSuccess()
    }
    return result
  }

  render() {
    return (
      <Screen>
        <View style={{flex: 40}}></View>
        <Hero xbackgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Subtitle>Як Вас звати?</Hero.Subtitle>
        </Hero>
        <View style={{flex: 30}}>
          <TextInput />
        </View>
        <View style={{flex: 20}}>
          <TouchableOpacity
              onPress={e => this.onStartAuth()}
              onLongPress={e => this.onStartAuth(true)}>
            <Button label='Зареєструватись' />
          </TouchableOpacity>
        </View>
      </Screen>
    )
  }
}
