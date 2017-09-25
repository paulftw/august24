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

import Contacts from 'react-native-contacts'

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
      user: 'anon',
      contacts: [],
    }
    this.state.busy = true
    // this.tryLogin()
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.setState({user})
        firedb.ref(`/users/${user.uid}/dataField`).set('set by the app')
      } else {
        // TODO logout
        alert('logged out')
      }
    })

    Contacts.getAll((err, data) => {
      if (err === 'denied') {
        alert('contacts denied')
      } else {
        this.setState({ contacts: data })
      }
    })

    this.getPushData()
  }

  async getPushData() {
    // firebase.messaging().requestPermissions()
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
      user = await firebase.auth().getCurrentUser()
      this.setState({
        user
      })
      alert(JSON.stringify(user))
    } catch (err) {
      alert('error: ' + JSON.stringify(err))
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
            <SectionHeader.Text>{this.state.contacts.length} ПАРТИЗАН</SectionHeader.Text>
          </SectionHeader>

          {this.state.contacts.map((c, key) => <TouchableOpacity key={key}>
            <Panel>
              <Title>{c.givenName} {c.familyName}</Title>
              <Text>{JSON.stringify(c.phoneNumbers.map(pn => pn.number))}</Text>
              <Label style={{container: Object.assign({}, floatRight(), centerVertical())}}>v5</Label>
            </Panel>
          </TouchableOpacity>)}
          {/*<TouchableOpacity>
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
          </Panel>*/}
        </ScrollView>

        <SectionHeader>
          <SectionHeader.Text>ЗАПРОСИТИ ДРУЗІВ</SectionHeader.Text>
        </SectionHeader>

        <Panel>
          <Title>User: {JSON.stringify(this.state.user.providerData)}</Title>
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
