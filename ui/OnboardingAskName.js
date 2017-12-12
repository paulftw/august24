import React, { Component } from 'react'

import firebase from '../firebase'

import {
  Button,
  Hero,
  Screen,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '../trvl'

export default class OnboardingAskName extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  async onSaveName() {
    await firebase.saveUserName(this.state.userName)
    this.props.onSuccess()
  }

  render() {
    return (
      <Screen>
        <View style={{flex: 40}}></View>
        <Hero xbackgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Subtitle>Як Вас звати?</Hero.Subtitle>
        </Hero>
        <View style={{flex: 30}}>
          <TextInput
            underlineColorAndroid={'white'}
            style={{color: 'white'}}
            onChangeText={(userName) => this.setState({userName})}
            placeholder={'Назвіться'}
            placeholderTextColor={'white'}
            value={this.state.userName} />
        </View>
        <View style={{flex: 20}}>
          <TouchableOpacity onPress={e => this.onSaveName()}>
            <Button label='Далі' />
          </TouchableOpacity>
        </View>
      </Screen>
    )
  }
}
