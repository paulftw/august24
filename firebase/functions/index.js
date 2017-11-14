import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp(functions.config().firebase)
const cors = require('cors')({origin: true})


const authenticatedHandler = function(handler) {
  return functions.https.onRequest((req, res) => {
    if (req.method !== 'POST') {
      res.status(403).send('Forbidden!');
    }

    cors(req, res, async function() {
      if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
            'Make sure you authorize your request by providing the following HTTP header:',
            'Authorization: Bearer <Firebase ID Token>.')
        res.status(403).send('Unauthorized')
        return
      }
      const idToken = req.headers.authorization.split('Bearer ')[1]
      try {
        const user = await admin.auth().verifyIdToken(idToken)
        if (user.aud !== 'sizzling-torch-7444' || user.exp < Date.now() / 1000) {
          console.error('Bad user token: ', user)
          res.status(403).send('Unauthorized')
          return
        }

        let result = handler(user, req, res)
        if (result instanceof Promise) {
          result = await result
        }
        res.status(200).send(result)
      } catch(e) {
        console.error('Caught error', e)
        res.status(500).send('Server Error')
      }
    })
  })
}

let debugEcho = authenticatedHandler((user, req, res) => {
  req.body.x2 = (req.body.x || 0) * (req.body.x || 0)
  req.body.user = user
  return req.body
})

export { debugEcho }

function updateRef(refPath, data) {
  return admin.database().ref(refPath).update(data)
}

function getRef(refPath) {
  return admin.database().ref(refPath)
}

async function readOnce(refOrPath) {
  if (typeof refOrPath === 'string') {
    refOrPath = getRef(refOrPath)
  }
  const snap = await refOrPath.once('value')
  return snap.val()
}

let writePhoneNumberOnCreate = functions.auth.user().onCreate(event => {
  let user = event.data
  updateRef(`/users/${user.uid}`, {
    phoneNumber: user.phoneNumber,
  })
})

export { writePhoneNumberOnCreate }

async function findUserByPhone(phoneNumber) {
  const userRef = getRef('/users/')
      .orderByChild('phoneNumber')
      .equalTo(phoneNumber)
  const userData = await readOnce(userRef)
  return userData ? Object.entries(userData)[0] : null
}

let uploadContacts = authenticatedHandler((user, req, res) => {
  // TODO check request schema
  const contacts = req.body.contacts || []

  const savedContacts = contacts.map(async function(contact) {
    const registeredUser = await findUserByPhone(contact.phoneNumber)
    const contactData = {
      phoneNumber: contact.phoneNumber,
      contactsName: contact.name,
      realName: registeredUser && registeredUser[1].name || contact.name,
      realNameSyncTimestamp: Date.now(),
      isRegistered: !!registeredUser,
      userId: registeredUser ? registeredUser[0] : null,
    }
    await updateRef(`/userContacts/${user.uid}/${contact.phoneNumber}`, contactData)
    return contactData
  })

  return Promise.all(savedContacts)
})

export { uploadContacts }

/*
curl -X POST -H "Content-Type:application/json" \
-d '{"userId": "MAgmpZTdWSPLL5sflTxE3KLpstJ3", "contacts": [
    { "phoneNumber": "+380502654463", "name": "Igor Igor" },
    { "phoneNumber": "+61412378113", "name": "Paul Straya" },
    { "phoneNumber": "+380935313429", "name": "Paul UA" }
  ]}' \
https://us-central1-sizzling-torch-7444.cloudfunctions.net/uploadContacts
*/

function addUserToChat(chatId, userId, isAdmin, chatState) {
  updateRef(`chatMembers/${chatId}/${userId}`, {
    isAdmin,
  })
  updateRef(`userChats/${userId}/${chatId}`, {
    lastOpenedTimestamp: -1,
    readMessages: 0,
    totalMessages: chatState.totalMessages,
    lastMessageTimestamp: chatState.lastMessageTimestamp,
  })
  return userId
}

async function allUserIdsValid(userIds) {
  let usersExist = userIds.map(uid => readOnce(`/users/${uid}`).then(userProfile => !!userProfile))
  // Reduce below does logical *and* of all user profiles - ( u1 && u2 && .. && u[n] )
  return (await Promise.all(usersExist)).reduce((u, sum) => u && sum, true)
}

async function findDirectChatForKey(directChatKey) {
  const chatRef = getRef('/chats/')
      .orderByChild('directChatKey')
      .equalTo(directChatKey)
  const chatData = await readOnce(chatRef)
  return chatData ? Object.keys(chatData)[0] : null
}

let createChat = authenticatedHandler(async function(user, req, res) {
  // TODO check input data schema
  const chatProps = {
    createdOn: Date.now(),
    createdBy: user.uid,
    totalMessages: 0,
    lastMessageTimestamp: 0,
  }
  let directChatKey = undefined
  if (req.body.isDirectChat) {
    if (req.body.members.length !== 1) {
      throw new Error('Direct chat can only have 1 extra member but got ' + JSON.stringify(req.body.members))
    }
    const alice = user.uid
    const bob = req.body.members[0]
    directChatKey = alice < bob ? `${alice}-${bob}` : `${bob}-${alice}`

    let existingChatId = await findDirectChatForKey(directChatKey)
    if (existingChatId) {
      return { chatId: existingChatId }
    }
  } else {
    //  !req.body.isDirectChat === false
    throw new Error('Only direct chats are supported')
  }

  const chatMembers = [...new Set([user.uid, ...req.body.members])]

  if (!await allUserIdsValid(chatMembers)) {
    throw new Error('WTF you passed a bad userId in ' + JSON.stringify(req.body.members))
  }

  // INVARIANT: all input data has been validated beyond this point!

  if (req.body.isDirectChat === true) {
      chatProps.isDirectChat = true
      chatProps.directChatKey = directChatKey
  }
  // TODO wrap all writes into a single database transaction
  const newChat = await getRef('/chats/').push(chatProps)

  const chatAdds = chatMembers.map(uid => addUserToChat(
      newChat.key,
      uid,
      user.uid === uid,
      chatProps))
  const addResults = await Promise.all(chatAdds)
  return {
    chatId: newChat.key,
    addResults,
  }
})

export { createChat }

async function getChatMembers(chatId) {
  return await readOnce('/chatMembers/' + chatId)
}

async function notifyMessage({
    userId,
    chatId,
    senderId,
    lastMessageTimestamp,
    totalMessages,
  }) {
  updateRef(`/userChats/${userId}/${chatId}`, {
    lastMessageTimestamp,
    totalMessages,
  })
}

let sendMessageToChat = authenticatedHandler(async function(user, req, res) {
  // TODO check request schema
  const chatId = req.body.chatId
  const senderId = user.uid
  const message = req.body.message

  const chatRef = getRef(`/chats/${chatId}`)
  const chatState = await readOnce(chatRef)
  if (!chatState) {
    throw new Error('Chat does not exist ' + chatId)
  }

  const members = Object.keys(await getChatMembers(chatId))

  if (members.indexOf(senderId) < 0) {
    throw new Error(`User ${senderId} has no write access to ${chatId}`)
  }

  if ([1, 2].indexOf(message.messageCode) < 0) {
    throw new Error(`What are yo trying to send? "${message.messageCode}" really???`)
  }

  // TODO in a transaction:
  const messageTimestamp = Date.now()
  getRef('/chatMessages/' + chatId).push({
    timestamp: messageTimestamp,
    senderId,
    message: { messageCode: message.messageCode },
  })

  const messageCount = (chatState.messageCount || 0) + 1
  chatRef.update({
    messageCount,
    lastMessageTimestamp: messageTimestamp,
  })

  members.map(userId => notifyMessage({
      userId,
      chatId,
      senderId,
      messageTimestamp,
      messageCount
  }))
  return {
    messageCount,
    lastMessageTimestamp: messageTimestamp,
  }
})

export { sendMessageToChat }
