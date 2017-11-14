import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View,
} from 'react-native'

import Transition from '../react-native-style-transition'

import {
  Icon,
  TopBar,
  TouchableOpacity,
  Screen,
} from '../trvl'

import firebase from '../firebase'
import Keyboard from './Keyboard'

function messageText(messageId) {
  return {
    '1': 'Слава Україні!',
    '2': 'Героям Слава!',
  }[messageId] || 'Bad Message #' + messageId
}

export default class Chat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      chatHistory: [],
    }
  }

  subscribe(messagesRef) {
    this.unsubscribe()

    this.messagesRef = messagesRef
    this.listener = this.messagesRef.orderByChild('timestamp')
      .on('value', snap => {
        const messages = []
        snap.forEach(msg => messages.push(Object.assign(
            {},
            msg.val(),
            {messageId: msg.key}
        )))
        this.setState({ chatHistory: messages })
        setTimeout(() => this.refs.messagesView.scrollToEnd({animated: true}), 100)
      })
  }

  unsubscribe() {
    if (this.listener) {
      this.messagesRef.off('value', this.listener)
      delete this.listener
      delete this.messagesRef
    }
  }

  componentWillMount() {
    this.subscribe(this.props.messagesRef)
  }

  componentWillReceiveProps(nextProps) {
    this.subscribe(nextProps.messagesRef)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  onSend(messageId) {
    firebase.rpc('sendMessageToChat', {
      chatId: this.props.chatId,
      message: {
        messageCode: messageId,
      },
    })
  }

  render() {
    return (
      <Screen>
        <TopBar leftIcon={(
          <TouchableOpacity onPress={this.props.onBack}>
            {TopBar.icon('ios-arrow-back')}
          </TouchableOpacity>
        )}>

          <TopBar.Title text={this.props.chatId} />
        </TopBar>

        <ScrollView ref='messagesView' style={{
              flex: 1,
            }}>
          {this.state.chatHistory.map((msg, key) => (
            <View key={key} style={{
              alignSelf: msg.senderId === this.props.myId ? 'flex-end' : 'flex-start',
              padding: 8,
              borderColor: msg.senderId === this.props.myId ? '#fff6' : '#12DFCA',
              borderWidth: 1,
              borderRadius: 8,
              margin: 4,
            }}>
              <Text style={{
                color: msg.senderId === this.props.myId ? '#fffb' : '#12DFCA',
              }}>{messageText(msg.message.messageCode)}</Text>
            </View>
          ))}
        </ScrollView>

        <Keyboard onSend={e => this.onSend(e.messageId)} />
      </Screen>
    )
  }
}
