import React, { Component } from 'react'

import {
  Button,
  Hero,
  Screen,
  Text,
  TouchableOpacity,
  View,
} from '../trvl'

export default class StartOnboarding extends Component {
  render() {
    return (
      <Screen>
        <View style={{flex: 1}}></View>
        <Hero xbackgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Title>Слава Україні!</Hero.Title>
          <Hero.Subtitle>Для доступу до мережі Вам необхідно зареєструватись</Hero.Subtitle>
        </Hero>
        <View style={{flex: 1}}></View>
        <TouchableOpacity onPress={e => this.props.signIn()}>
          <Button label='Зареєструватись' />
        </TouchableOpacity>
      </Screen>
    )
  }
}
