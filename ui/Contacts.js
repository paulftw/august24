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
  BottomNav,
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

import firebase from '../firebase'

export default class Conversations extends Component {
  render() {
    return (
      <Screen>
        <Hero backgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Title>Контакти</Hero.Title>
        </Hero>

        <ScrollView>
          <SectionHeader>
            <SectionHeader.Text>{this.props.contacts.length} ПАРТИЗАН</SectionHeader.Text>
          </SectionHeader>

          {this.props.contacts.map((c, key) => <TouchableOpacity key={key} onPress={e=>firebase.rpc('debugEcho', {key: key})}>
            <Panel>
              <Title>{c.name}</Title>
              <Label style={{container: Object.assign({}, floatRight(), centerVertical())}}>v5</Label>
            </Panel>
          </TouchableOpacity>)}
        </ScrollView>

        {this.props.bottomNav.render()}
      </Screen>
    )
  }
}
