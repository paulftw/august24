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
      {this.pages.map((page, index) => {
        const active = page.url === this.router.getRoute()
        return <BottomNav.Button objectId={'bottomBtn-' + page.url}
            active={active}
            onPress={e => this.router.navigate(page.url)}
            icon={BottomNav.icon(page.icon, active, 'bottomIcon-' + page.url)}
            label={page.label}
            badge={page.badge ? BottomNav.badge({active, label: page.badgeLabel, objectId: 'bottomBadge-' + page.url, }) : null}
            key={index}
          />
      })}
    </BottomNav>
  }
}
