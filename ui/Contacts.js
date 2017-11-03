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
  Tab,
  TabBar,
  Text,
  Title,
} from '../trvl'

import firebase from '../firebase'

export default class Conversations extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filter: 'inNetwork',
    }
  }

  setFilter(filter) {
    this.setState({filter})
  }

  render() {
    const contacts = this.state.filter === 'all' ? this.props.contacts
        : this.props.contacts.filter(c => c.userId)
    return (
      <Screen>
        <Hero backgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Title>Контакти</Hero.Title>
        </Hero>

        <TabBar>
          <Tab title="Свої" active={this.state.filter === 'inNetwork'} onPress={e => this.setFilter('inNetwork')} />
          <Tab title="Всі" active={this.state.filter === 'all'} onPress={e => this.setFilter('all')} />
        </TabBar>

        <ScrollView>
          <SectionHeader>
            <SectionHeader.Text>{contacts.length} ПАРТИЗАН</SectionHeader.Text>
          </SectionHeader>

          {contacts.map((c, key) => <TouchableOpacity key={key}>
              <Panel>
                <Title>{c.name}</Title>
                <Text>{c.phonenumber}</Text>
              </Panel>
            </TouchableOpacity>)
          }
        </ScrollView>

        {this.props.bottomNav.render()}
      </Screen>
    )
  }
}
