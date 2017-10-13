import React, { Component } from 'react'
import {
  Dimensions,
  Image,
  ProgressViewIOS,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import Contacts from 'react-native-contacts'

import {
  centerVertical,
  floatRight,
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
  constructor(props) {
    super(props)
    this.state = {
      foo: 'no foo yet',
      user: 'anon',
      contacts: [],
    }
    // this.tryLogin()
  }

  render() {
    return (
      <Screen>
        <Hero backgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Title>Розмови</Hero.Title>
        </Hero>

        <ScrollView>
          <SectionHeader>
            <SectionHeader.Text>{this.state.contacts.length} РОЗМОВ</SectionHeader.Text>
          </SectionHeader>
        </ScrollView>

        {this.props.bottomNav.render()}
      </Screen>
    )
  }
}
