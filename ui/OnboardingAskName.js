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

  async componentWillMount() {
    const userName = await firebase.getUserName()
    this.setState({userName})
  }

  async onSaveName() {
    await firebase.saveUserName(this.state.userName)
    this.props.onSuccess()
  }

  render() {
    return (
      <Screen avoidKeyboard={true}>
        <View style={{flex: 40}}></View>
        <Hero>
          <Hero.Subtitle>Як Вас звати?</Hero.Subtitle>
        </Hero>
        <View style={{flex: 30}}>
          <TextInput
            onChangeText={(userName) => this.setState({userName})}
            placeholder={'Назвіться'}
            onSubmitEditing={e => this.onSaveName()}
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
