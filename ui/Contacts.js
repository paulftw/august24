import React, { Component } from 'react'
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'

import {
  centerVertical,
  floatRight,
  Hero,
  HighlightRow,
  Icon,
  Label,
  Panel,
  Screen,
  SectionHeader,
  Tab,
  TabBar,
  Text,
  Title,
} from '../trvl'

import firebase, { snapshotToList } from '../firebase'

export default class Contacts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      contacts: [],
      filter: 'inNetwork',
    }
  }

  componentWillMount() {
    this.contactsSubscription = this.props.contacts
        .map(snapshotToList)
        .subscribe(contacts => this.setState({ contacts }))
  }

  componentWillUnmount() {
    this.contactsSubscription.unsubscribe()
  }

  setFilter(filter) {
    this.setState({filter})
  }

  render() {
    let contacts = this.state.filter === 'all'
        ? this.state.contacts
        : this.state.contacts.filter(c => c[1].userId)
    contacts.sort((a, b) => a[1].contactsName > b[1].contactsName)

    return (
      <Screen>
        <Hero backgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Title>Контакти</Hero.Title>
        </Hero>

        <TabBar>
          <Tab title="Свої" active={this.state.filter === 'inNetwork'} onPress={e => this.setFilter('inNetwork')} />
          <Tab title="Всі" active={this.state.filter === 'all'} onPress={e => this.setFilter('all')} />
        </TabBar>

        <ScrollView>
          <SectionHeader>
            <SectionHeader.Text>{contacts.length} ПАРТИЗАН</SectionHeader.Text>
          </SectionHeader>

          {contacts.map(([key, c]) => <TouchableOpacity
                key={key}
                onPress={e => c.userId && this.props.openChat(c.directChatKey, c.userId)}>
              <Panel>
                <Title>{c.contactsName}</Title>
                <Text>{c.phoneNumber}</Text>
              </Panel>
            </TouchableOpacity>)
          }
        </ScrollView>

        {this.props.bottomNav.render()}
      </Screen>
    )
  }
}
