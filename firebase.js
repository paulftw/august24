import Firebase from 'react-native-firebase'

const firebase = Firebase.initializeApp({
  persistence: true,
})

firebase.firedb = firebase.database()

export default firebase
