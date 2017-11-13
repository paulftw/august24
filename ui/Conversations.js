import moment from 'moment/min/moment-with-locales'
moment.locale('uk')

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
  // constructor(props) {
  //   super(props)
  // }

  render() {
    return (
      <Screen>
        <Hero backgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Title>Розмови</Hero.Title>
        </Hero>

        <ScrollView>
          <SectionHeader>
            <SectionHeader.Text>{this.props.conversations.length} РОЗМОВ</SectionHeader.Text>
          </SectionHeader>

          {this.props.conversations.map((c, key) => {
            const unreadCount = c.totalMessages - c.readMessages
            return <TouchableOpacity key={key} onPress={e => this.props.openChat(c.roomId)}>
              <Panel>
                <Title>{c.roomId}</Title>
                <Text>
                  {c.totalMessages
                    ? moment(c.lastMessageTimestamp).locale('uk').fromNow()
                    : null
                  }
                </Text>
                {unreadCount
                  ? <Label style={{container: Object.assign({}, floatRight(), centerVertical())}}>
                    {unreadCount}
                  </Label>
                  : <Label type='transparent' style={{container: Object.assign({}, floatRight(), centerVertical())}}>
                    {c.messageCount}
                  </Label>
                }
              </Panel>
            </TouchableOpacity>
          })}
        </ScrollView>

        {this.props.bottomNav.render()}
      </Screen>
    )
  }
}
