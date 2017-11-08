import React from 'react'

import { BottomNav, Text } from '../trvl'

export default class _BottomNav {
  constructor(router) {
    this.router = router
    this.pages = [
      {
        url: 'Contacts',
        label: 'Контакти',
        icon: 'ios-list-box-outline',
      },
      {
        url: 'Conversations',
        label: 'Розмови',
        icon: 'ios-chatbubbles-outline',
      },
      {
        url: 'Settings',
        label: 'Налаштування',
        icon: 'ios-settings-outline',
      },
    ]
  }

  render() {
    return <BottomNav>
      {this.pages.map((page, index) => (
        <BottomNav.Button objectId={'bottomBtn-' + page.url}
          active={page.url === this.router.getRoute()}
          onPress={e => this.router.navigate(page.url)}
          icon={BottomNav.icon(page.icon, page.url === this.router.getRoute(), 'bottomIcon-' + page.url)}
          label={page.label}
          key={index}
        />
      ))}
    </BottomNav>
  }
}
