export default class DataModel {
  constructor(firebase) {
    this.firebase = firebase
  }

  getContacts() {
    // TODO: replace with real contacts, not dummy data
    return [
      {
        name: 'Боб Марлєй',
        phonenumber: '+900123',
        userId: null,
        screenName: null,
      },
      {
        name: 'Ігор Єрьомін',
        phonenumber: '+380777',
        userId: 'foobar',
        screenName: null,
      },
      {
        name: 'Степан Бандера',
        phonenumber: '+380999',
        userId: null,
        screenName: null,
      },
      {
        name: 'Павло Коржик',
        phonenumber: '+380888',
        userId: 'foo2',
        screenName: 'Павло',
      },
      {
        name: 'Остап Бендер',
        phonenumber: '+380444',
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
