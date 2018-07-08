import 'mocha'

import { expect } from 'chai'
import { ObjectNavigator, ObjectPath } from '@nofrills/types'

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

  interface Profile {
    favorites: {
      links: string[]
    }
  }

  interface Person {
    address: Address
    contacts: Contact[]
    name: Name
    profile: Profile
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
    },
    profile: {
      favorites: {
        links: ['google.com', 'news.google.com', 'mail.google.com']
      }
    }
  }

  it('should create instance over an object', () => {
    const sut = ObjectNavigator.from(person)
    const properties = Array.from(sut).map(x => x.key)
    expect(sut.name).to.equal('')
    expect(properties).contains('address')
    expect(properties).contains('contacts')
    expect(properties).contains('name')
  })

  it('should navigate to child property', () => {
    const sut = ObjectNavigator.from(person)
    const profile: ObjectPath = sut.value('profile')
    const favorites: ObjectPath = profile.navigator.value('favorites')
    const links: ObjectPath = favorites.navigator.value('links')
    expect(links.path).to.equal('profile.favorites')
  })

  it('should navigate to child property value', () => {
    const sut = ObjectNavigator.from(person)
    const name = sut.get<Name>('name')
    expect(name.first).to.equal('Joshua')
    expect(name.last).to.equal('Tree')
  })

})
