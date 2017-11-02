import React, { Component } from 'react'

import { DEBUG, log } from '../debugtools'
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
    log('starting auth debug=', debug)
    const result = (DEBUG && debug) ? await firebase.signInDebugUser() : await firebase.startAuth()
    log('firebase signin result', result)
    if (result) {
      this.props.onSuccess ? this.props.onSuccess() : alert('should send user to permissions')
    }
    return result
  }

  componentDidMount() {
    log('mounted StartOnboarding')
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
