import React, { Component } from 'react'
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'

import Communications from 'react-native-communications'

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
  Tab,
  TabBar,
  Text,
  Title,
} from '../trvl'

import firebase, { snapshotToList } from '../firebase'

export default class Contacts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      contacts: [],
      directChatForUser: {},
      filter: 'inNetwork',
    }
  }

  componentWillMount() {
    this.contactsSubscription = this.props.contacts
        .map(snapshotToList)
        .subscribe(contacts => this.setState({ contacts }))

    this.conversationsSubscription = this.props.conversations
        .map(snapshotToList)
        .map(conversations => conversations.reduce((dict, [key, chat]) => {
            if (!chat.directChatKey) {
              return dict
            }
            return Object.assign({}, dict, {[firebase.getOtherUserId(chat.directChatKey)]: key})
          }, {}))
        .subscribe(directChatForUser => this.setState({ directChatForUser }))
  }

  componentWillUnmount() {
    this.contactsSubscription.unsubscribe()
    this.conversationsSubscription.unsubscribe()
  }

  setFilter(filter) {
    this.setState({filter})
  }

  async onPressContact(key, contact) {
    if (!contact.userId) {
      // TODO: give visual feedback that the contact is not in the app
      Communications.text(contact.phoneNumber, "Привіт! Запрошую встановити класний додаток - зайди в AppStore і пошукай \"Слава Україні\"")
      return
    }
    const chatId = this.state.directChatForUser[contact.userId]
    if (chatId) {
      this.props.openChat(chatId, this.displayName(contact))
    } else {
      // TODO timeout & error handling
      const newChat = await firebase.rpc('createChat', {
        members: [contact.userId],
        isDirectChat: true,
      })
      this.props.openChat(newChat.chatId, this.displayName(contact))
    }
  }

  displayName(contact) {
    return contact.contactsName || contact.realName
  }

  render() {
    let contacts = this.state.filter === 'all'
        ? this.state.contacts
        : this.state.contacts.filter(c => c[1].userId)
    contacts.sort((a, b) => this.displayName(a[1]) > this.displayName(b[1]))

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

          {contacts.map(([key, contact]) => <TouchableOpacity
                key={key}
                onPress={e => this.onPressContact(key, contact)}>
              <Panel>
                <Title>{this.displayName(contact)}</Title>
                <Text>{contact.phoneNumber}</Text>
              </Panel>
            </TouchableOpacity>)
          }
        </ScrollView>

        {this.props.bottomNav.render()}
      </Screen>
    )
  }
}
