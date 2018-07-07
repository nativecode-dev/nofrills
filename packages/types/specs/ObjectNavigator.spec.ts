import 'mocha'

import { expect } from 'chai'
import { ObjectNavigator } from '../src/index'

describe('when using ObjectNavigator', () => {

  interface Address {
    line1: string
    line2: string
    city: string
    state: string
    zip: string
  }

  interface Contact {
    email: string
  }

  interface Name {
    first: string
    last: string
  }

  interface Person {
    address: Address
    contacts: Contact[]
    name: Name
  }

  const person: Person = {
    address: {
      line1: '123 Main Street',
      line2: 'Suite 100',
      city: 'Nowhere',
      state: 'Florida',
      zip: '99004',
    },
    contacts: [{
      email: 'joshua.tree@holyshit.com',
    }, {
      email: 'josuha.tree@gmail.com'
    }],
    name: {
      first: 'Joshua',
      last: 'Tree',
    }
  }

  it('should create instance over an object', () => {
    const sut = ObjectNavigator.inspect(person)
    const properties = Array.from(sut).map(x => x.key)
    expect(properties).contains('address')
    expect(properties).contains('contacts')
    expect(properties).contains('name')
  })

})
