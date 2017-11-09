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
  req.body.x2 = (req.body.x || 0) * (req.body.x || 0) * 100
  req.body.user = user
  return req.body
})

export { debugEcho as debugEcho }

let writePhoneNumberOnCreate = functions.auth.user().onCreate(event => {
  let user = event.data
  admin.database().ref(`/users/${user.uid}`).update({
    phoneNumber: user.phoneNumber,
  })
})

export { writePhoneNumberOnCreate }

async function findUserByPhone(phoneNumber) {
  const userRef = admin.database().ref(`/users/`)
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
    admin.database().ref(`/users/${user.uid}/contacts/${contact.phoneNumber}`).set(contactData)
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
