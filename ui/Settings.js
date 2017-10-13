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

import Contacts from 'react-native-contacts'

import {
  centerVertical,
  floatRight,
  BottomNav,
  Hero,
  HighlightRow,
  Icon,
  Label,
  Panel,
  Screen,
  SectionHeader,
  Text,
  Title,
} from '../trvl'

export default class Conversations extends Component {
  constructor(props) {
    super(props)
    this.state = {
      foo: 'no foo yet',
      user: 'anon',
      contacts: [],
    }
    // this.tryLogin()
  }

  render() {
    return (
      <Screen>
        <Hero backgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Title>Asdf ghs</Hero.Title>
          <Hero.Subtitle>Hello1</Hero.Subtitle>
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

        {this.props.bottomNav.render()}
      </Screen>
    )
  }
}
