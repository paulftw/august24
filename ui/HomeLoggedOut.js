import React, { Component } from 'react'
import {
  Dimensions,
  Image,
  NativeModules,
  ProgressViewIOS,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import {
  centerVertical,
  floatRight,
  Hero,
  HighlightRow,
  Label,
  Panel,
  Screen,
  SectionHeader,
  Text,
  Title,
} from '../trvl'
import firebase from '../firebase'
const firedb = firebase.firedb

console.log('Text is ', Text)

export default class HomeLoggedOut extends Component {
  constructor(props) {
    super(props)
    this.state = {
      foo: 'no foo yet',
      busy: false,
      pushes: [],
    }
    this.state.busy = true
    // this.tryLogin()
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        // alert('has user ' + JSON.stringify(user.uid))
        firedb.ref(`/users/${user.uid}/phone`).set('0412378113')
      } else {
        // TODO logout
      }
    })

    this.getPushData()
  }

  async getPushData() {
    firebase.messaging().requestPermissions()
    const initPush = await firebase.messaging().getInitialNotification()
    if (initPush) {
      this.state.pushes.push(initPush)
      this.setState({
        pushes: this.state.pushes,
      })
    }
    firebase.messaging().onMessage(msg => {
      this.state.pushes.push(msg)
      this.setState({
        pushes: this.state.pushes,
      })
    })
  }

  async pressFUI() {
    try {
      const user = await NativeModules.RNFirebaseUI.showLogin()
      alert(JSON.stringify(user))
    } catch (err) {
      alert('error: ' + JSON.stringify(err.userInfo))
    }
  }

  render() {
    return (
      <Screen>
        <Hero backgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Title>Friday</Hero.Title>
          <Hero.Subtitle>August24</Hero.Subtitle>
        </Hero>

        <ScrollView>
          <SectionHeader>
            <SectionHeader.Text>45 ПАРТИЗАН</SectionHeader.Text>
          </SectionHeader>

          <TouchableOpacity>
            <Panel>
              <Title>Игорь Еремин</Title>
              <Text>Слава Україні!</Text>
              <Label style={{container: Object.assign({}, floatRight(), centerVertical())}}>v5</Label>
            </Panel>
          </TouchableOpacity>

          <TouchableOpacity>
            <Panel>
              <Title>Игорь Еремин</Title>
              <Text>Слава Україні!</Text>
              <Label style={{container: Object.assign({}, floatRight(), centerVertical())}}>v5</Label>
            </Panel>
          </TouchableOpacity>

          <TouchableOpacity>
            <Panel>
              <Title>Павло Коржик</Title>
              <Text>Слава Україні!</Text>
              <Label type='transparent' style={{container: Object.assign({}, floatRight(), centerVertical())}}>&gt;</Label>
            </Panel>
          </TouchableOpacity>

          <Panel>
            <Title>Семен Семенченко</Title>
            <Text>Героям Слава!</Text>
            <Label style={{container: Object.assign({}, floatRight(), centerVertical())}}>3</Label>
          </Panel>
        </ScrollView>

        <SectionHeader>
          <SectionHeader.Text>ЗАПРОСИТИ ДРУЗІВ</SectionHeader.Text>
        </SectionHeader>

        <Panel>
          <Title>5 second interval updates</Title>
          <TouchableOpacity onPress={e => this.pressFUI()}>
            <Text>Fire UI</Text>
          </TouchableOpacity>
          <Text>{JSON.stringify(this.state.pushes)}</Text>
        </Panel>

        {this.state.busy ? <ProgressViewIOS /> : null}

        <Image source={{uri: this.state.photoUrl}} />

      </Screen>
    )
  }
}
