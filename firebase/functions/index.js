import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp(functions.config().firebase)

const cors = require('cors')({origin: true})

let writePhoneNumberOnCreate = functions.auth.user().onCreate(event => {
  let user = event.data
  admin.database().ref(`/users/${user.uid}`).update({
    phoneNumber: user.phoneNumber,
  })
})

async function findUserByPhone(phoneNumber) {
  const  userRef = admin.database().ref(`/users/`)
      .orderByChild('phoneNumber')
      .equalTo(phoneNumber)
  const userData = (await userRef.once('value')).val()
  return userData ? Object.entries(userData)[0] : null
}

let uploadContacts = functions.https.onRequest((req, res) => {

  if (req.method !== 'POST') {
    res.status(403).send('Forbidden!');
  }

  cors(req, res, () => {
    const userId = req.body.userId
    const contacts = req.body.contacts || []

    const savedContacts = contacts.map(async function(contact) {
      const registeredUser = await findUserByPhone(contact.phoneNumber)
      const contactData = {
        phoneNumber: contact.phoneNumber,
        contactsName: contact.name,
        realName: registeredUser ? registeredUser[1].name || contact.name : contact.name,
        isRegistered: !!registeredUser,
        userId: registeredUser ? registeredUser[0] : null,
      }
      admin.database().ref(`/users/${userId}/contacts/${contact.phoneNumber}`).set(contactData)
      return contactData
    })

    Promise.all(savedContacts).then(savedContacts => {
      res.status(200).send(savedContacts)
    })

    /*

curl -X POST -H "Content-Type:application/json" \
-d '{"userId": "MAgmpZTdWSPLL5sflTxE3KLpstJ3", "contacts": [
    { "phoneNumber": "+380502654463", "name": "Igor Igor" },
    { "phoneNumber": "+61412378113", "name": "Paul Straya" },
    { "phoneNumber": "+380935313429", "name": "Paul UA" }
  ]}' \
https://us-central1-sizzling-torch-7444.cloudfunctions.net/uploadContacts

   */
  })
})

export { writePhoneNumberOnCreate, uploadContacts }
