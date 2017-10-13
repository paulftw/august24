import React, { Component } from 'react'
import {
  ScrollView,
  TouchableOpacity,
} from 'react-native'

import Contacts from 'react-native-contacts'

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
} from '../trvl'

export default class Conversations extends Component {
  onLogout() {
    this.props.onLogout ? this.props.onLogout() : alert('Нажаль ліниві програмісти не реалізували цю кнопку')
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
        </ScrollView>

        {this.props.bottomNav.render()}
      </Screen>
    )
  }
}
