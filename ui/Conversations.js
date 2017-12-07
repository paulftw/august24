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
  constructor(props) {
    super(props)
    this.state = {
      chats: [],
    }
  }

  componentWillMount() {
    // TODO: unsubscribe / resubscribe when props are being changed by a parent component
    this.listener = this.props.conversationsRef
      .orderByChild('lastMessageTimestamp')
      .on('value', snap => {
        const chats = []
        snap.forEach(chat => chats.push(Object.assign(
            {},
            chat.val(),
            {chatId: chat.key}
        )))
        chats.reverse()
        this.setState({ chats })
      })
  }

  componentWillUnmount() {
    this.props.conversationsRef.off('value', this.listener)
    delete this.listener
  }

  render() {
    return (
      <Screen>
        <Hero backgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Title>Розмови</Hero.Title>
        </Hero>

        <ScrollView>
          <SectionHeader>
            <SectionHeader.Text>{this.state.chats.length} РОЗМОВ</SectionHeader.Text>
          </SectionHeader>

          {this.state.chats.map((c, key) => {
            const unreadCount = c.totalMessages - c.readMessages
            return <TouchableOpacity key={key} onPress={e => this.props.openChat(c.chatId)}>
              <Panel>
                <Title>{c.chatId}</Title>
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
