import React from 'react'

import Conversations from './Conversations'
import LoadingScreen from './LoadingScreen'
import StartOnboarding from './StartOnboarding'
import Router from './Router'

export default function createRouter(rootComponent) {
  return new Router(rootComponent, {
    routes: {
      'Conversations': routeParams => <Conversations />,
      'LoadingScreen': routeParams => <LoadingScreen />,
      'StartOnboarding': routeParams => <StartOnboarding />,
    },
    initialRoute: 'LoadingScreen',
  })
}
