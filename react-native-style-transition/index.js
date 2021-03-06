import React, { Component } from 'react'
import { Animated, Easing, } from 'react-native'

import TweenValue from './TweenValue'

const valuesCache = {}

function getCachedValues(objectId, compValues) {
  if (!objectId) {
    return compValues
  }
  if (valuesCache[objectId]) {
    return valuesCache[objectId]
  }
  return valuesCache[objectId] = compValues
}

export default class Transition extends Component {
  constructor(props) {
    super(props)
    this.values = {}
    this.objectId = props.objectId
  }

  tweenStyle(style) {
    let newStyle = {}
    const transition = this.props.transition || {}
    const defaultTransition = transition.all || {
      duration: this.props.duration,
      easing: this.props.easing || Easing.inOut(Easing.ease),
    }
    style && Object.entries(style).map(([key, value]) => {
      if (!this.values[key]) {
        this.values[key] = new TweenValue(value)
      }
      this.values[key].setTarget(style[key], transition[key] || defaultTransition)
      newStyle[key] = this.values[key].val()
    })
    return newStyle
  }

  componentWillUnmount() {
    Object.values(this.values).map(val => val.killAnimation())
  }

  render() {
    if (this.objectId !== this.props.objectId) {
      console.warn(`Transition's objectId has changed from "${this.objectId}" to "${this.props.objectId}" this will cause weird and unspecified behaviour!`)
    }
    this.values = getCachedValues(this.props.objectId, this.values)

    const { style } = this.props
    const Compo = this.props.component ? Animated.createAnimatedComponent(this.props.component) : Animated.View
    return <Compo {...this.props} style={this.tweenStyle(style)} />
  }
}
