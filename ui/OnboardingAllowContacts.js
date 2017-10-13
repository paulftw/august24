import React, { Component } from 'react'

import {
  Button,
  Hero,
  Screen,
  Text,
  TouchableOpacity,
  View,
} from '../trvl'

export default class OnboardingAllowContacts extends Component {
  render() {
    return (
      <Screen>
        <View style={{flex: 40}}></View>
        <Hero xbackgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Title>Давайте знайдемо Ваших друзів</Hero.Title>
          <Hero.Subtitle>Нам потрібен доступ до Вашого списку контактів, щоб знайти Ваших друзів</Hero.Subtitle>
        </Hero>
        <View style={{flex: 10}}></View>
        <TouchableOpacity style={{flex: 20}} onPress={e => alert('TODO: ask for contacts permission')}>
          <Button label='Завантажити контакти' />
        </TouchableOpacity>
      </Screen>
    )
  }
}
