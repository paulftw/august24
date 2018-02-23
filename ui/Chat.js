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

import firebase, { snapshotToList } from '../firebase'

import Keyboard, { messageText } from './Keyboard'

export default class Chat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      chatMessages: [],
    }
  }

  componentWillMount() {
    // TODO: unsubscribe / resubscribe when props are being changed by a parent component
    this.messagesSubscription = this.props.messages
        .map(snapshotToList)
        .map(messages => messages.map(([key, msg]) => Object.assign(
            {},
            msg,
            {messageId: key},
        )))
        .subscribe(messages => this.setState({ chatMessages: messages }))
  }

  componentWillUnmount() {
    this.messagesSubscription.unsubscribe()
  }

  async onSend(messageId) {
    this.props.messagesRef.push({
      senderId: firebase.authUser.uid,
      timestamp: Date.now(),
      message: {
        messageCode: messageId,
      },
    })

    setTimeout(() => this.refs.messagesView.scrollToEnd({animated: true}), 200)
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
          {this.state.chatMessages.map((msg, key) => (
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
