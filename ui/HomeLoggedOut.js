import React, { Component } from 'react'
import {
  Dimensions,
  Image,
  ProgressViewIOS,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginButton,
} from 'react-native-fbsdk'

import trvl, {
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
    }
    this.state.busy = true
    this.tryLogin()
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
    });
  }

  async tryLogin() {
    try {
      const token = await AccessToken.getCurrentAccessToken()
      if (!token) {
        throw 'nonLogged INN'
      }
      let authData = await firebase.auth().signInWithCredential({
        provider: 'facebook',
        token: token.accessToken,
      })
      this.setState({ photoUrl: authData.photoURL })
      authData = JSON.parse(JSON.stringify(authData))
      authData.refreshToken = '<eraser />'
    } catch (err) {
      err !== 'nonLogged INN' && alert('access token FAIL ' + err)
    } finally {
      this.setState({ busy: false })
    }
  }

  onLoginFinished(error, result) {
    if (error) {
      alert("login has error: " + result.error)
    } else if (result.isCancelled) {
      alert("login is cancelled.")
    } else {
      // TODO: logged in AccessToken.getCurrentAccessToken().then(
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

          <LoginButton
            readPermissions={["email", "public_profile", "user_friends"]}
            onLoginFinished={this.onLoginFinished.bind(this)}
            onLogoutFinished={() => alert("logout.")}/>
          <Text>{JSON.stringify(this.props.meta)}</Text>
        </Panel>

        {this.state.busy ? <ProgressViewIOS /> : null}

        <Image source={{uri: this.state.photoUrl}} />

      </Screen>
    )
  }
}
