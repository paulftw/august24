import PropTypes from 'prop-types'
import React, { Component } from 'react'
import RNative, { Dimensions, Image, StatusBar, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const backgroundColor = '#12131E'
const fontRegular = 'Raleway-Regular'
const fontMedium = 'Raleway-Medium'
const textColorNormal = '#fff6'
const textColorLoud = '#fff'
const textColorMuted = '#fff3'

const colorActive = '#12DFCA'

const grayBG = '#1C1E2A'
const lightGrayBG = '#262935'

const fontSize = {
  heroH1: 32,
  heroH2: 17,

  H1: 17,

  normal: 13,
}

const gridCellSize = 8
let gridCells = 20
let gridMargin = 0

function cells(num) {
  return num * gridCellSize
}

const screenGutter = cells(1)
const smallStep = cells(1.5)
const verticalStep = cells(1.5)

function recalculateGrid(screenWidth) {
  gridCells = Math.floor(screenWidth / gridCellSize)
  gridMargin = (screenWidth - gridCells * gridCellSize) / 2
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeStyle(...styles) {
  let res = Object.assign({}, styles[0])
  for (var i = 1; i < styles.length; i++) {
    const o = styles[i]
    for (var k in o) {
      if (isObject(res[k])) {
        Object.assign(res[k], o[k])
      } else {
        res[k] = o[k]
      }
    }
  }
  return res
}

export class Hero extends Component {
  getPropsWithDefaults(parentProps) {
    const res = Object.assign({
      height: 200,
      width: '100%',
    }, parentProps)
    return res
  }

  render() {
    const props = this.getPropsWithDefaults(this.props)
    return <View style={{
        height: props.height,
        marginLeft: -this.context.screenMargin,
        marginRight: -this.context.screenMargin,
        marginBottom: verticalStep,
      }}>
      <Image source={props.backgroundImage} style={{
          height: props.height,
          resizeMode: 'cover',
          width: props.width,
        }}>
        <LinearGradient colors={['#0000', '#12131Eff']} style={{
            height: props.height,
            position: 'absolute',
            width: props.width,
          }}>
        </LinearGradient>
        <View style={{
            alignItems: 'center',
            backgroundColor: '#0000',
            flex: 1,
            justifyContent: 'center',
          }}>
          {this.props.children}
        </View>
      </Image>
    </View>
  }
}
Hero.contextTypes = {
  screenMargin: PropTypes.number.isRequired,
}

Hero.Title = class HeroTitle extends Component {
  render() {
    return <RNative.Text style={{
        color: textColorLoud,
        fontFamily: fontRegular,
        fontSize: fontSize.heroH1,
        marginBottom: smallStep,
        textShadowColor: '#0009',
        textShadowOffset: {width: -0.001, height: 0},
        textShadowRadius: 10,
      }}>
      {this.props.children}
    </RNative.Text>
  }
}

Hero.Subtitle = class HeroSubtitle extends Component {
  render() {
    return <RNative.Text style={{
        color: textColorLoud,
        fontFamily: fontMedium,
        fontSize: fontSize.heroH2,
        textShadowColor: '#0009',
        textShadowOffset: {width: -0.001, height: 0},
        textShadowRadius: 10,
      }}>
      {this.props.children}
    </RNative.Text>
  }
}

export class Screen extends Component {
  componentDidMount() {
    this.dimensionsEventHandler = this.onNewDimensions.bind(this)
    Dimensions.addEventListener('change', this.dimensionsEventHandler)
    this.onNewDimensions({screen: Dimensions.get('screen')})
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.dimensionsEventHandler)
  }

  onNewDimensions(dim) {
    recalculateGrid(dim.screen.width)
    this.setState(dim.screen)
  }

  getChildContext() {
    return {
      screenMargin: gridMargin + gridCellSize,
    }
  }

  render() {
    return <View style={{
      backgroundColor: backgroundColor,
      flex: 1,
      paddingLeft: gridMargin + screenGutter,
      paddingRight: gridMargin + screenGutter,
    }}>
      <StatusBar hidden={true} barStyle='light-content' />
      {this.props.children}
      <Text style={{color: '#fff'}}>{JSON.stringify(this.state)}</Text>
    </View>
  }
}
Screen.childContextTypes = {
  screenMargin: PropTypes.number.isRequired,
}

export class SectionHeader extends Component {
  render() {
    return <View style={{
        marginBottom: verticalStep,
        paddingLeft: smallStep,
        paddingRight: smallStep,
      }}>
      {this.props.children}
    </View>
  }
}
SectionHeader.Text = (props) => (<RNative.Text style={{
      color: '#fff6',
      fontSize: fontSize.normal,
      fontFamily: fontMedium,
    }}>
    {props.children}
  </RNative.Text>)

export class Panel extends Component {
  render() {
    return <View style={{
        backgroundColor: grayBG,
        borderRadius: 4,
        marginBottom: verticalStep,
        padding: smallStep,
      }}>
      {this.props.children}
    </View>
  }
}

export class HighlightRow extends Component {
  render() {
    return <View style={{
        backgroundColor: lightGrayBG,
        marginBottom: verticalStep,
        padding: smallStep,
        marginLeft: -smallStep,
        marginRight: -smallStep,
      }}>
      {this.props.children}
    </View>
  }
}

export class Text extends Component {
  render() {
    return <RNative.Text style={mergeStyle({
        color: '#fff6',
        fontSize: fontSize.normal,
        fontFamily: fontRegular,
      }, this.props.style)}>
      {this.props.children}
    </RNative.Text>
  }
}

export class Title extends Component {
  render() {
    return <RNative.Text style={{
        color: '#fff',
        fontSize: fontSize.H1,
        fontFamily: fontRegular,
        marginBottom: verticalStep,
      }}>
      {this.props.children}
    </RNative.Text>
  }
}

export function floatRight() {
  return {
    position: 'absolute',
    right: smallStep,
  }
}

export function centerVertical() {
  return {
    position: 'absolute',
    top: '50%',
  }
}


export class Label extends Component {
  render() {
    const types = {
      highlight: {
        backgroundColor: colorActive,
        color: textColorLoud,
      },
      muted: {
        backgroundColor: textColorMuted,
        color: '#000',
      },
      info: {
        backgroundColor: textColorNormal,
        color: textColorLoud,
      },
      transparent: {
        backgroundColor: '#0000',
        color: textColorMuted,
      },

    }
    const baseStyle = {
      container: {
        borderRadius: 13,
        flex: -1,
        height: 26,
        minWidth: 26,
        overflow: 'hidden',
        position: 'absolute',
      },
      text: mergeStyle(this.props.type ? types[this.props.type] : types.highlight, {
        lineHeight: fontSize.normal * 2,
        fontSize: fontSize.normal,
        flex: 0,
        fontFamily: fontMedium,
        textAlign: 'center',
      }),
    }
    const style = mergeStyle(baseStyle, this.props.style || {})
    return <View style={style.container}>
        <Text style={style.text}>
          {this.props.children}
        </Text>
      </View>
  }
}

export class BottomNav extends Component {
  render() {
    return <View style={null}>
      {this.props.children}
    </View>
  }
}
