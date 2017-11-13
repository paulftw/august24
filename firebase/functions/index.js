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
        console.log('Sending response', result)
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

let writePhoneNumberOnCreate = functions.auth.user().onCreate(event => {
  let user = event.data
  admin.database().ref(`/users/${user.uid}`).update({
    phoneNumber: user.phoneNumber,
  })
})

export { writePhoneNumberOnCreate }

async function findUserByPhone(phoneNumber) {
  const userRef = admin.database().ref('/users/')
      .orderByChild('phoneNumber')
      .equalTo(phoneNumber)
  const userData = (await userRef.once('value')).val()
  return userData ? Object.entries(userData)[0] : null
}

let uploadContacts = authenticatedHandler((user, req, res) => {
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
    admin.database().ref(`/userContacts/${user.uid}/contacts/${contact.phoneNumber}`).set(contactData)
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

function addUserToRoom(roomId, userId, isAdmin) {
  const db = admin.database()

  db.ref(`chatMembers/${roomId}/${userId}`).set({
    isAdmin: false,
  })
  db.ref(`userRooms/${userId}/${roomId}`).set({
    lastOpenedTimestamp: -1,
    readMessages: 0,
    totalMessages: 0,
    lastMessageTimestamp: 0,
  })
  return userId
}

let createRoom = authenticatedHandler(async function(user, req, res) {
  // TODO: check if a room exists
  const chatProps = {
    createdOn: Date.now(),
    createdBy: user.uid,
    messageCount: 0,
    lastMessageTimestamp: 0,
  }
  // TODO check that all members are valid user Ids
  if (req.body.members.length < 1) {
    throw new Error('wtf not enough members in ' + JSON.stringify(req.body.members))
  }
  if (!req.body.isDirectChat) {
    throw new Error('Only direct chats are supported')
  }
  if (req.body.isDirectChat === true && req.body.members.length === 1) {
      chatProps.isDirectChat = true
      const alice = user.uid
      const bob = req.body.members[0]
      chatProps.directChatKey = alice < bob ? `${alice}-${bob}` : `${bob}-${alice}`
  }
  // TODO wrap all writes into a single database transaction
  const newRoom = await admin.database().ref('/chatRooms/').push(chatProps)

  // TODO do not add self more than once - run unique on the array below
  const roomAdds = [user.uid, ...req.body.members].map(uid => addUserToRoom(
      newRoom.key,
      uid,
      user.uid === uid))
  const addResults = await Promise.all(roomAdds)
  return {
    roomId: newRoom.key,
    addResults,
  }
})

export { createRoom }

async function getRoomMembers(roomId) {
  const snap = await admin.database().ref('/chatMembers/' + roomId).once('value')
  return Object.keys(snap.val())
}

async function notifyMessage(userId, roomId, senderId, lastMessageTimestamp, totalMessages) {
  admin.database().ref(`/userRooms/${userId}/${roomId}`).update({
    lastMessageTimestamp,
    totalMessages,
  })
}

let sendMessageToRoom = authenticatedHandler(async function(user, req, res) {
  const roomId = req.body.roomId
  const senderId = user.uid
  const message = req.body.message
  // TODO make sure room exists
  // TODO make sure user has write access to the room
  // TODO check message contents - is there a valid messageCode?

  // TODO in a transaction:
  const messageTimestamp = Date.now()
  admin.database().ref('/chatMessages/' + roomId).push({
    timestamp: messageTimestamp,
    senderId,
    message: { messageCode: message.messageCode },
  })

  const roomRef = admin.database().ref('/chatRooms/' + roomId)
  const roomState = (await roomRef.once('value')).val()
  const messageCount = (roomState.messageCount || 0) + 1
  roomRef.update({
    messageCount,
    lastMessageTimestamp: messageTimestamp,
  })

  const members = await getRoomMembers(roomId)
  members.map(userId => notifyMessage(userId, roomId, senderId, messageTimestamp, messageCount))
  return {
    messageCount,
    lastMessageTimestamp: messageTimestamp,
  }
})
export { sendMessageToRoom }
