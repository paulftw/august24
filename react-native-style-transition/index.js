import React, { Component } from 'react'
import { Animated, Easing, } from 'react-native'

import TweenValue from './TweenValue'

export default class Transition extends Component {
  constructor(props) {
    super(props)
    this.values = {}
  }

  tweenStyle(style) {
    let newStyle = {}
    Object.entries(style).map(([key, value]) => {
      if (!this.values[key]) {
        this.values[key] = new TweenValue(value)
      }
      this.values[key].setTarget(style[key], {
        duration: this.props.duration,
        easing: this.props.easing || Easing.inOut(Easing.ease),
      })
      newStyle[key] = this.values[key].val()
    })
    return newStyle
  }

  componentWillUnmount() {
    Object.values(this.values).map(val => val.killAnimation())
  }

  render() {
    const { style } = this.props
    const Compo = this.props.component || Animated.View
    return <Compo {...this.props} style={this.tweenStyle(style)} />
  }
}
