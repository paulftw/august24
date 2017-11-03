import PropTypes from 'prop-types'
import React, { Component } from 'react'
import RNative, {
  ActivityIndicator,
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
    return <TouchableOpacity style={{
          padding: smallStep,
          borderColor: this.props.active ? colorActive : '#9000',
          borderRadius: 1000,
          borderWidth: 1,
          alignItems: 'center',
          width: 80,
        }}
        onPress={this.props.onPress}
        >
      <Text style={{
        color: this.props.active ? colorActive : textColorNormal,
      }}>{this.props.title}</Text>
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

        <Text style={{
            color: this.props.active ? textColorLoud : textColorNormal,
          }}>
          {this.props.label}
        </Text>

        {!this.props.active ? <View style={{height: 1.5}} /> :
          <View style={{
            backgroundColor: colorActive,
            height: 1.5,
            shadowOffset: { width: -1, height: -1 },
            shadowColor: colorActive,
            shadowOpacity: 0.375,
            width: '100%',
          }}></View>
        }
      </TouchableOpacity>
  }
}

BottomNav.icon = function(name, active) {
  return <Icon name={name} color={active ? textColorLoud : textColorNormal} size={20} />
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
