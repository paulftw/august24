import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  TouchableWithoutFeedback,
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

function messageText(messageId) {
  return {
    '1': 'Слава Україні!',
    '2': 'Героям Слава!',
  }[messageId] || ''+messageId
}

class Keyboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messageId: null,
      focused: false,
    }
  }

  onSend() {
    if (this.state.messageId) {
      this.props.onSend({messageId: this.state.messageId})
      this.setState({messageId: null})
    } else {
      this.setState({focused: true})
    }
  }

  onMessage(messageId) {
    if (messageId && this.state.messageId) {
      // Do nothing, message already in buffer
      return
    }
    this.setState({messageId})
  }

  onFocus() {
    this.setState({focused: true})
  }

  render() {
    const btnStyle = {
      backgroundColor: '#fff',
      borderRadius: 6,
      marginBottom: 4,
      marginTop: 4,
      marginLeft: 2,
      marginRight: 2,
      paddingLeft: 8,
      paddingRight: 8,
      padding: 4,
      flex: 0,

      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2,},
      shadowRadius: 1,
      shadowOpacity: 0.75,
    }

    const inputHeightBase = 24
    const sendButtonSize = 28

    const btnTextStyle = {
      fontSize: 17,
    }

    return <View style={{
      backgroundColor: '#d2d5dc',
      marginLeft: -10,
      marginRight: -10,
    }}>
      <TouchableWithoutFeedback onPress={e => this.onFocus()}>
        <View style={{
            backgroundColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
          <View style={{
            flex: 1,
            margin: 4,
            borderColor: '#12131E',
            borderRadius: 10,
            borderWidth: 1,
            height: inputHeightBase,
            paddingLeft: 8,
            paddingRight: 10,
          }}>
            <Text style={{
              color: this.state.messageId ? '#333' : '#666',
              fontStyle: this.state.messageId ? null : 'italic',
              fontSize: inputHeightBase - 7,
            }}>{this.state.messageId ? messageText(this.state.messageId) : 'Повідомлення'}</Text>
        </View>
        <TouchableOpacity
            onPress={e => this.onSend()}
            style={{
              backgroundColor: '#12DFCA',
              width: sendButtonSize,
              height: sendButtonSize,
              borderRadius: sendButtonSize / 2,
              overflow: 'hidden',
              margin: 4,
              padding: 2,
            }}>
          <Icon
              name='ios-paper-plane'
              style={{color: '#fff'}}
              size={sendButtonSize - 4}
          />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
    <Transition duration={250} style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      opacity: this.state.focused ? 1 : 0,
      paddingTop: this.state.focused ? 8 : 0,
      paddingBottom: this.state.focused ? 8 : 0,
      height: this.state.focused ? 54 : 0,
    }}>
      <TouchableOpacity onPress={e => this.onMessage(1)} style={btnStyle}>
        <Text style={btnTextStyle}>{messageText(1)}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={e => this.onMessage(2)} style={btnStyle}>
        <Text style={btnTextStyle}>{messageText(2)}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={e => this.onMessage(0)} style={btnStyle}>
        <Icon
            name='ios-backspace-outline'
            style={{color: '#000', marginTop: 2, marginBottom: -2}}
            size={20}
        />
      </TouchableOpacity>
    </Transition>
    </View>
  }
}

export default class Chat extends Component {
  constructor(props) {
    super(props)

    this.msgCodeCode = 100

    this.state = {
      chatHistory: [],
    }
    this.props.onMessages(this.props.chatId, chatHistory => this.setState({chatHistory}))
  }

  onSend(messageId) {
    firebase.rpc('sendMessageToRoom', {
      roomId: this.props.chatId,
      message: {
        messageCode: messageId,
      },
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
