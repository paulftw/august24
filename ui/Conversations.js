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

import firebase, { snapshotToList } from '../firebase'

export default class Conversations extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chats: [],
      knownUserNames: {},
      user: null,
    }
  }

  subscribe(props) {
    this.unsubscribe()

    this.conversationsSubscription = props.conversations
        .map(snapshotToList)
        .map(conversations => conversations.map(([key, convo]) => Object.assign(
            {},
            convo,
            {chatId: key},
        )))
        .subscribe(chats => {
          chats.reverse()
          this.setState({ chats })
        })

    this.contactsSubscription = props.contacts
        .map(snapshotToList)
        .map(contacts => contacts.reduce((names, [key, contact]) => contact.userId
            ? Object.assign({}, names, {[contact.userId]: contact.contactsName})
            : names,
            {}))
        .subscribe(knownUserNames => this.setState({ knownUserNames }))

    this.authSubscription = firebase.addAuthListener(() => this.setState({ user: firebase.authUser }))
  }

  unsubscribe() {
    if (this.conversationsSubscription) {
      this.conversationsSubscription.unsubscribe()
      delete this.conversationsSubscription
    }

    if (this.contactsSubscription) {
      this.contactsSubscription.unsubscribe()
      delete this.contactsSubscription
    }

    if (this.authSubscription) {
      firebase.removeAuthListener(this.authSubscription)
      delete this.authSubscription
    }
  }

  componentWillMount() {
    this.subscribe(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.subscribe(nextProps)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  getDirectChatDisplayName(directChatKey) {
    if (!this.state.user || !directChatKey) {
      return null
    }

    const otherUserId = firebase.getOtherUserId(directChatKey)
    return this.state.knownUserNames[otherUserId]
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
                <Title>{this.getDirectChatDisplayName(c.directChatKey) || 'Невідомий'}</Title>
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
