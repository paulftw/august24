import React, { Component } from 'react'

import firebase from '../firebase'

import {
  Button,
  Hero,
  Screen,
  Text,
  TouchableOpacity,
  View,
} from '../trvl'

export default class StartOnboarding extends Component {

  async onStartAuth(debug) {
    const result = debug ? await firebase.signInDebugUser() : await firebase.startAuth()
    if (result) {
      this.props.onSuccess ? this.props.onSuccess() : alert('should send user to permissions')
    }
    return result
  }

  render() {
    return (
      <Screen>
        <View style={{flex: 40}}></View>
        <Hero xbackgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Title>Слава Україні!</Hero.Title>
          <Hero.Subtitle>Для доступу до мережі Вам необхідно зареєструватись</Hero.Subtitle>
        </Hero>
        <View style={{flex: 30}}></View>
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
