export default class DataModel {
  constructor(firebase) {
    this.firebase = firebase
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
}
