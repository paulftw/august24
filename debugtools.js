import React, { Component } from 'react'
import {
  Text,
  View,
} from 'react-native'

import firebase from './firebase'

const DEBUG = true

export { DEBUG }

export async function performDebugRpc() {
  const resp = await firebase.rpc('debugEcho', {a: 300, x: 16, })
  alert('echo Resp ' + JSON.stringify(resp))
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
  val = typeof val === 'string' ? ('' + val) : (JSON.stringify(val) || 'undefined')
  return val.length <= 32 ? val : val.substring(0, 30) + '...'
}

export function jsonShort(value) {
  if (!(value instanceof Object)) {
    return shortString(value)
  }
  const fields = Object.entries(value).map(el => `  ${el[0]}: ${shortString(el[1])}`)
  return ['{', ...fields, '}'].join('\n')
}

export class DebugOverlay extends Component {

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


  render() {
    return <View style={{ flex: 1 }}>
      <View style={{
        backgroundColor: '#fff9',
        position: 'absolute',
        right: 5,
        top: 32,
        width: 200,
        // height: 32,
        zIndex: 10000,
      }}>
        {this.renderSticky()}
        {this.renderMsg()}
      </View>
      {this.props.children}
    </View>
  }
}
