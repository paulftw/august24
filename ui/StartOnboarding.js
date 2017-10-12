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

  onStartAuth(debug) {
    if (debug) {
      // TODO add debug user
    }

    const result = await firebase.startAuth()
    if (result) {
      this.props.gotoPermissions ? this.props.gotoPermissions() : alert('should send user to permissions')
    }
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
        <TouchableOpacity style={{flex: 20}} onPress={e => firebase.startAuth()}>
          <Button label='Зареєструватись' />
        </TouchableOpacity>
      </Screen>
    )
  }
}
