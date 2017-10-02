import React, { Component } from 'react'

import {
  Hero,
  Screen,
  Text,
} from '../trvl'

export default class LoadingScreen extends Component {
  render() {
    return (
      <Screen>
        <Hero backgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Title>Перевірка особи...</Hero.Title>
          <Hero.Subtitle>Будь ласка, зачекайте</Hero.Subtitle>
        </Hero>
      </Screen>
    )
  }
}
