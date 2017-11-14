import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import firebase from './firebase'

const DEBUG = false
// TODO: disable anonymous sign in in production

export { DEBUG }

export async function performDebugRpc() {
  // const resp = await firebase.rpc('debugEcho', {
  //   members: ['e9TruDgoyXOohFNgt8GY7M0VclU2'],
  //   isDirectChat: true,
  //   x: 103,
  // })
  // log('debug resp ', resp)
  // alert('deb resp ' + JSON.stringify(resp))


  // +380935313429
  const UID_PAUL = 'o5vH1n5RMQc0fBvgsDvuKZhtARe2'
  // +380502654463
  const UID_IGOR = 'e9TruDgoyXOohFNgt8GY7M0VclU2'

  const resp = await firebase.rpc('createChat', {
    members: [UID_PAUL],
    isDirectChat: true,
  })
  log('createChat resp ', resp)
}

let debugSticky = {}
let debugMsg = []

export function log(...args) {
  console.log.apply(console, args)
  debugMsg.push(args)
  debugMsg = debugMsg.slice(-1000)
}

export function debugValue(key, value) {
  debugSticky[key] = value
}

function shortString(val) {
  const LEN = 128
  val = typeof val === 'string' ? ('' + val) : (JSON.stringify(val) || 'undefined')
  return val.length <= LEN ? val : val.substring(0, LEN - 3) + '...'
}

export function jsonShort(value) {
  if (!(value instanceof Object)) {
    return shortString(value)
  }
  const fields = Object.entries(value).map(el => `  ${el[0]}: ${shortString(el[1])}`)
  return ['{', ...fields, '}'].join('\n')
}

export class DebugOverlay extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  renderSticky() {
    const list = Object.entries(debugSticky).map((el, indx) => <View key={indx}><Text>{el[0]}: {jsonShort(el[1])}</Text></View>)
    return <View>{list}</View>
  }

  renderMsg() {
    const list = debugMsg.slice(-10).map((el, indx) => <View key={indx} style={{ flexDirection: 'row' }}>
      {el.map((item, indx) => <View key={indx}><Text>{shortString(item)}</Text></View>)}
    </View>)
    return <View>{list}</View>
  }

  componentDidMount() {
    this.timer = setInterval(() => this.setState({ currentTime: Date.now()}), 500)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  hideSelf(duration) {
    this.setState({hidden: true})
    setTimeout(e => this.setState({hidden: false}), duration)
  }


  render() {
    return <View style={{ flex: 1 }}>
      {this.state.hidden ? null : <TouchableOpacity
          onPress={e => this.hideSelf(5000)}
          onLongPress={e => this.hideSelf(30 * 1000)}
          style={{
            backgroundColor: '#fff9',
            position: 'absolute',
            right: 5,
            top: 32,
            width: 360,
            zIndex: 10000,
          }}>
        {this.renderSticky()}
        {this.renderMsg()}
      </TouchableOpacity>}
      {this.props.children}
    </View>
  }
}
