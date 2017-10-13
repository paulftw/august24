import React from 'react'

import BottomNav from './BottomNav'
import Contacts from './Contacts'
import Conversations from './Conversations'
import LoadingScreen from './LoadingScreen'
import OnboardingAllowContacts from './OnboardingAllowContacts'
import OnboardingAskName from './OnboardingAskName'
import OnboardingStart from './OnboardingStart'
import Router from './Router'
import Settings from './Settings'


export default function createRouter(rootComponent) {
  const router = new Router(rootComponent, {
    routes: {
      'Conversations': routeParams => <Conversations bottomNav={new BottomNav(router)} />,
      'Contacts': routeParams => <Contacts
          bottomNav={new BottomNav(router)}
          contacts={rootComponent.state.contacts}
        />,
      'Settings': routeParams => <Settings bottomNav={new BottomNav(router)} />,

      'LoadingScreen': routeParams => <LoadingScreen />,

      'OnboardingStart': routeParams => <OnboardingStart
          onSuccess={() => router.navigate('OnboardingAskName')}
        />,
      'OnboardingAskName': routeParams => <OnboardingAskName
          onSuccess={() => router.navigate('OnboardingAllowContacts')}
        />,
      'OnboardingAllowContacts': routeParams => <OnboardingAllowContacts
          onSuccess={() => router.navigate('Contacts')}
        />,
    },
    initialRoute: 'LoadingScreen',
  })
  return router
}
