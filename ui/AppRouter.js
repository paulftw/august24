import React from 'react'

import BottomNav from './BottomNav'
import Chat from './Chat'
import Contacts from './Contacts'
import Conversations from './Conversations'
import LoadingScreen from './LoadingScreen'
import OnboardingAllowContacts from './OnboardingAllowContacts'
import OnboardingAskName from './OnboardingAskName'
import OnboardingStart from './OnboardingStart'
import Router from './Router'
import Settings from './Settings'

import { log } from '../debugtools'
import firebase from '../firebase'

export default function createRouter(rootComponent) {
  const router = new Router(rootComponent, {
    routes: {
      'Conversations': routeParams => <Conversations
          bottomNav={new BottomNav(router)}
          contacts={firebase.getObservableRef('/userContacts/' + firebase.authUser.uid)}
          conversations={firebase.getObservableRef('/userChats/' + firebase.authUser.uid, {
            orderByChild: 'lastMessageTimestamp',
          })}
          openChat={(chatId, chatName) => router.navigate('Chat', {chatId, chatName, from: 'Conversations'})}
        />,
      'Contacts': routeParams => <Contacts
          bottomNav={new BottomNav(router)}
          contacts={firebase.getObservableRef('/userContacts/' + firebase.authUser.uid)}
          conversations={firebase.getObservableRef('/userChats/' + firebase.authUser.uid, {
            orderByChild: 'lastMessageTimestamp',
          })}
          openChat={(chatId, chatName) => router.navigate('Chat', {chatId, chatName, from: 'Contacts'})}
        />,
      'Settings': routeParams => <Settings bottomNav={new BottomNav(router)}
          onLogout={e => rootComponent.onLogout()}
          onChangeName={e => router.navigate('SettingsChangeName')}
          // TODO: onOpenAllowContacts is used for debug only
          onOpenAllowContacts={e => router.navigate('OnboardingAllowContacts')}
        />,

      'Chat': routeParams => <Chat
          chatId={routeParams.chatId}
          chatName={routeParams.chatName}
          messagesRef={firebase.getRef(`/chatMessages/${routeParams.chatId}`)}
          messages={firebase.getObservableRef(`/chatMessages/${routeParams.chatId}`, {
            orderByChild: 'timestamp',
          })}
          userChatState={firebase.getRef(`/userChats/${firebase.authUser.uid}/${routeParams.chatId}`)}
          onBack={e => router.navigate(routeParams.from)}
        />,

      'LoadingScreen': routeParams => <LoadingScreen />,

      'OnboardingStart': routeParams => <OnboardingStart
          onSuccess={() => {log('onboarding success'); router.navigate('OnboardingAskName')}}
        />,
      'OnboardingAskName': routeParams => <OnboardingAskName
          onSuccess={() => router.navigate('OnboardingAllowContacts')}
        />,
      'OnboardingAllowContacts': routeParams => <OnboardingAllowContacts
          onSuccess={() => router.navigate('Contacts')}
        />,

      'SettingsChangeName': routeParams => <OnboardingAskName
          onSuccess={() => router.navigate('Settings')}
        />,
    },
    initialRoute: 'LoadingScreen',
  })
  return router
}

log('Router initialized')
