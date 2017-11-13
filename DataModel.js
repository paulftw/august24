export default class DataModel {
  constructor(firebase, user) {
    this.firebase = firebase
    this.user = user
  }

  onConversations(fn) {
    if (!this.user) {
      return
    }
    this.firebase.ref('/userRooms/' + this.user.uid)
      .orderByChild('lastMessageTimestamp')
      .on('value', snap => {
        const rooms = []
        snap.forEach(room => rooms.push(Object.assign(
            {},
            room.val(),
            {roomId: room.key}
        )))
        rooms.reverse()
        fn(rooms)
      })
  }

  subToMessages(roomId, cb) {
    this.firebase.ref('/chatMessages/' + roomId)
      .orderByChild('timestamp')
      .on('value', snap => {
        const messages = []
        snap.forEach(msg => messages.push(Object.assign(
            {},
            msg.val(),
            {messageId: msg.key})))
        cb(messages)
      })
  }

  getContacts() {
    // TODO: replace with real contacts, not dummy data
    return [
      {
        name: 'Боб Марлєй',
        phoneNumber: '+900123',
        userId: null,
        screenName: null,
      },
      {
        name: 'Ігор Єрьомін',
        phoneNumber: '+380777',
        userId: 'foobar',
        screenName: null,
      },
      {
        name: 'Степан Бандера',
        phoneNumber: '+380999',
        userId: null,
        screenName: null,
      },
      {
        name: 'Павло Коржик',
        phoneNumber: '+380888',
        userId: 'foo2',
        screenName: 'Павло',
      },
      {
        name: 'Остап Бендер',
        phoneNumber: '+380444',
        userId: null,
        screenName: null,
      },
    ]
  }

  getConversations() {
    return [
      {
        userIds: [],
        messageCount: 9,
        readCount: 9,
        lastMessageTimestamp: Date.now() - 3600*13*1000,
      },
      {
        userIds: [],
        messageCount: 16,
        readCount: 15,
        lastMessageTimestamp: Date.now() - 3600*Math.PI*1000*24,
      },
      {
        userIds: [],
        messageCount: 30,
        readCount: 0,
        lastMessageTimestamp: Date.now() - 1e7,
      },
    ]
  }
}
