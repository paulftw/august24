import PropTypes from 'prop-types'
import React, { Component } from 'react'
import RNative, {
  ActivityIndicator,
  Animated,
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'

import Transition from '../react-native-style-transition'

const backgroundColor = '#12131E'
const fontRegular = 'Raleway-Regular'
const fontMedium = 'Raleway-Medium'
const textColorNormal = '#fff6'
const textColorLoud = '#fff'
const textColorMuted = '#fff3'

const colorActive = '#12DFCA'

const grayBG = '#1C1E2A'
const lightGrayBG = '#262935'

const footerBG = '#1E2029'
const footerTextColorInactive = '#78797E'
const footerTextColorActive = textColorLoud

const transitionDuration = 250

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

export { Icon, TextInput, TouchableOpacity, View, }

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
      <ImageBackground source={props.backgroundImage} style={{
          height: props.height,
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
      </ImageBackground>
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
        fontVariant: ['lining-nums'],
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
        fontVariant: ['lining-nums'],
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

    </View>
  }
}
Screen.childContextTypes = {
  screenMargin: PropTypes.number.isRequired,
}

export class Spinner extends Component {
  render() {
    return <ActivityIndicator animated={true} color={colorActive} size='large' />
  }
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
      fontVariant: ['lining-nums'],
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

export class TabBar extends Component {
  render() {
    return <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: verticalStep,
    }}>
      {this.props.children}
    </View>
  }
}

export class Tab extends Component {
  render() {
    return <TouchableOpacity onPress={this.props.onPress}>
      <Transition
          duration={transitionDuration}
          style={{
            padding: smallStep,
            borderColor: this.props.active ? colorActive : 'transparent',
            borderRadius: 1000,
            borderWidth: 1,
            alignItems: 'center',
            width: 80,
          }}
          >
        <Transition component={Text}
            duration={transitionDuration}
            style={{
              color: this.props.active ? colorActive : textColorNormal,
            }}>
          {this.props.title}
        </Transition>
      </Transition>
    </TouchableOpacity>
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
        fontVariant: ['lining-nums'],
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
        fontVariant: ['lining-nums'],
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

export class TopBar extends Component {
  render() {
    return <View style={{
        backgroundColor: footerBG,
        flexDirection: 'row',
        height: 40,
        marginBottom: 10,

        marginLeft: -this.context.screenMargin,
        marginRight: -this.context.screenMargin,

        paddingTop: smallStep,
        paddingLeft: this.context.screenMargin + 20,
        paddingRight: this.context.screenMargin + 20,

        top: 0,
      }}>
      <View style={{
            position: 'absolute',
            top: smallStep,
            left: this.context.screenMargin,
            width: 20,
          }}>
        {this.props.leftIcon}
      </View>
      <View style={{
          alignItems: 'center',
          backgroundColor: '#0000',
          flex: 1,
          justifyContent: 'flex-start',
        }}>
        {this.props.children}
      </View>
    </View>
  }
}
TopBar.contextTypes = {
  screenMargin: PropTypes.number.isRequired,
}

TopBar.icon = function(name, objectId) {
  return <Icon
      name={name}
      objectId={objectId}
      style={{color: textColorLoud}}
      size={20}
  />
}

class TopBarTitle extends Component {
  render() {
    return <Text style={{
          color: textColorLoud,
          fontSize: fontSize.H1,
        }}>
      {this.props.text}
    </Text>
  }
}
TopBar.Title = TopBarTitle

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
    return <View style={{
        backgroundColor: footerBG,
        flexDirection: 'row',
        height: 60,
        marginLeft: -this.context.screenMargin,
        marginRight: -this.context.screenMargin,
      }}>
      {this.props.children}
    </View>
  }
}
BottomNav.contextTypes = {
  screenMargin: PropTypes.number.isRequired,
}

BottomNav.Button = class BottomNavButton extends Component {
  render() {
    return <TouchableOpacity
      onPress={this.props.onPress}
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 11,
      }}>
        {this.props.icon}
        {this.props.badge}

        <Transition component={Text} duration={transitionDuration} objectId={'text-' + this.props.objectId} style={{
            color: this.props.active ? textColorLoud : textColorNormal,
          }}>
          {this.props.label}
        </Transition>

        <Transition duration={transitionDuration} objectId={'line-' + this.props.objectId} style={{
            backgroundColor: this.props.active ? colorActive : undefined,
            height: 1.5,
            shadowOffset: this.props.active ? { width: -1, height: -1 } : undefined,
            shadowColor: this.props.active ? colorActive : undefined,
            shadowOpacity: this.props.active ? 0.375 : undefined,
            width: '100%',
          }}/>
      </TouchableOpacity>
  }
}

const ICON_SIZE = 24
const BADGE_SIZE_WITH_TEXT = 20
const BADGE_SIZE_EMPTY = 14

BottomNav.icon = function(name, active, objectId) {
  return <Transition
      duration={transitionDuration}
      component={Icon}
      name={name}
      objectId={objectId}
      style={{color: active ? textColorLoud : textColorNormal}}
      size={ICON_SIZE}
  />
}

BottomNav.badge = function({ active, label, objectId, }) {
  const BADGE_SIZE = label ? BADGE_SIZE_WITH_TEXT : BADGE_SIZE_EMPTY
  return <Transition
      duration={transitionDuration}
      objectId={objectId}
      style={{
        alignItems: 'center',
        position: 'absolute',
        right: '50%',
        marginRight: - 1.1 * BADGE_SIZE,
        top: 10,
        height: BADGE_SIZE,
        width: BADGE_SIZE,
        borderWidth: 2,
        borderColor: footerBG,
        backgroundColor: colorActive,
        opacity: active ? 1 : 0.5,
        overflow: 'hidden',
        borderRadius: BADGE_SIZE / 2,
      }}
    >
      {!label ? null : <Text style={{
          fontSize: BADGE_SIZE - 6,
          lineHeight: BADGE_SIZE - 4,
          fontWeight: 'bold',
          textAlign: 'center',
          color: 1 + active ? textColorLoud : footerBG,
        }}>{label}</Text>
      }
    </Transition>
}

export class Button extends Component {
  renderText(text) {
    return <Text style={{
      fontSize: fontSize.H1,
      color: colorActive,
    }}>
      {text.toLocaleUpperCase()}
    </Text>
  }

  render() {
    return <View style={{
        alignItems: 'center',
        borderColor: colorActive,
        borderRadius: 22.5,
        borderWidth: 1,
        height: 45,
        justifyContent: 'center',
        marginBottom: verticalStep,
        marginLeft: 20,
        marginRight: 20,
      }}>
      {this.props.label ? this.renderText(this.props.label) : this.props.children}
    </View>
  }
}
