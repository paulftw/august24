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

  onSend(messageId) {
    this.setState({
      chatHistory: [...this.state.chatHistory, {
        message: { messageCode: messageId },
        my: (this.state.chatHistory.length % 5 < 2),
      }]
    })

    setTimeout(() => this.refs.messagesView.scrollToEnd({animated: true}), 100)
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
