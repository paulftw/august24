import React, { Component } from 'react'
import { Linking } from 'react-native'
import Contacts from 'react-native-contacts'

import Enum from '../Enum'
import {
  Button,
  Hero,
  Screen,
  Spinner,
  Text,
  TouchableOpacity,
  View,
} from '../trvl'

const ContactsPermission = Enum('Pending', 'Undefined', 'Authorized', 'Denied')

export default class OnboardingAllowContacts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      permission: ContactsPermission.Pending,
    }
  }

  componentDidMount() {
    this.checkPermission()
    this.permissionTimer = setInterval(() => this.checkPermission(), 2000)
  }

  componentWillUnmount() {
    clearInterval(this.permissionTimer)
  }

  checkPermission() {
    Contacts.checkPermission((err, permission) => this.parsePermission(permission, err))
  }

  parsePermission(permission, err) {
    const permissionMap = {
      [Contacts.PERMISSION_AUTHORIZED]: ContactsPermission.Authorized,
      [Contacts.PERMISSION_DENIED]: ContactsPermission.Denied,
      [Contacts.PERMISSION_UNDEFINED]: ContactsPermission.Undefined,
    }
    permission = permissionMap[permission]
    this.setState({ permission })
    if (permission === ContactsPermission.Authorized) {
      this.loadContacts()
    }
  }

  loadContacts() {
    if (this.contactsLoaded) {
      return
    }
    Contacts.getAll((err, contacts) => {
      if (err) {
        // TODO: inspect error
        return
      }
      if (this.contactsLoaded) {
        return
      }
      this.contactsLoaded = true
      this.processContacts(contacts)
    })
  }

  processContacts(contacts) {
    alert(`Found ${contacts.length} contacts. Let's move on`)
    // TODO: actually process
    // TODO: record to cloud the fact we had contacts at one point
    this.props.onSuccess()
  }

  renderButton() {
    const permission = this.state.permission
    if (permission === ContactsPermission.Pending
        || permission === ContactsPermission.Authorized) {
      return <Spinner />
    }
    if (permission === ContactsPermission.Denied) {
      return <TouchableOpacity onPress={e => Linking.openURL('app-settings:')}>
        <Button label='Перейти до налаштувань' />
      </TouchableOpacity>
    }

    return <TouchableOpacity onPress={e => Contacts.requestPermission((err, p) => this.parsePermission(p, err))}>
      <Button label='Завантажити контакти' />
    </TouchableOpacity>
  }

  renderSubtitle() {
    const permission = this.state.permission
    if (permission === ContactsPermission.Pending || permission === ContactsPermission.Authorized) {
      return <Hero.Subtitle>Зачекайте хвилинку, завантажуємо адресну книгу</Hero.Subtitle>
    }
    if (permission === ContactsPermission.Denied) {
      return <Hero.Subtitle>Будь-ласка відкрийте налаштування і дозвольте нам доступ до списку контактів</Hero.Subtitle>
    }
    return <Hero.Subtitle>Нам потрібен доступ до Вашого списку контактів, щоб знайти Ваших друзів</Hero.Subtitle>
  }

  render() {
    return (
      <Screen>
        <View style={{flex: 40}}></View>
        <Hero xbackgroundImage={require('../assets/images/lavra1.jpg')}>
          <Hero.Title>Давайте знайдемо Ваших друзів</Hero.Title>
          {this.renderSubtitle()}
        </Hero>
        <View style={{flex: 10}}></View>
        <View style={{flex: 20}}>
          {this.renderButton()}
        </View>
      </Screen>
    )
  }
}
