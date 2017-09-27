import * as functions from 'firebase-functions'

import * as admin from 'firebase-admin'
admin.initializeApp(functions.config().firebase)


let writePhoneNumberOnCreate = functions.auth.user().onCreate(event => {
  let user = event.data
  admin.database().ref(`/users/${user.uid}/phoneNumber`).set(user.phoneNumber)
})

export { writePhoneNumberOnCreate }
