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

  componentWillMount() {
    // TODO: unsubscribe / resubscribe when props are being changed by a parent component
    this.conversationslistener = this.props.conversationsRef
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

    this.contactsSubscription = this.props.contacts
        .map(snapshotToList)
        .map(contacts => contacts.reduce((names, [key, contact]) => contact.userId
            ? Object.assign({}, names, {[contact.userId]: contact.contactsName})
            : names,
            {}))
        .subscribe(knownUserNames => this.setState({ knownUserNames }))

      this.authSubscription = firebase.addAuthListener(() => this.setState({ user: firebase.authUser }))
  }

  componentWillUnmount() {
    this.props.conversationsRef.off('value', this.conversationslistener)
    delete this.conversationslistener

    this.contactsSubscription.unsubscribe()

    firebase.removeAuthListener(this.authSubscription)
  }

  getDirectChatDisplayName(directChatKey) {
    if (!this.state.user || !directChatKey) {
      return null
    }

    const me = this.state.user.uid
    let otherUserId = null
    if (directChatKey.endsWith(`-${me}`)) {
      otherUserId = directChatKey.substring(0, directChatKey.length - me.length - 1)
    }
    if (directChatKey.startsWith(`${me}-`)) {
      otherUserId = directChatKey.substring(me.length + 1)
    }
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
