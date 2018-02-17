import React, { Component } from 'react'
import {
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import Transition from '../react-native-style-transition'

import {
  Icon,
  TouchableOpacity,
} from '../trvl'

function messageText(messageId) {
  return {
    '1': 'Слава Україні!',
    '2': 'Героям Слава!',
  }[messageId] || 'Bad Message #' + messageId
}

export default class Keyboard extends Component {
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
