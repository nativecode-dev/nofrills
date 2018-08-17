import 'mocha'

import { expect } from 'chai'
import { ObjectNavigator } from '../src'

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
    const properties = Array.from(sut).map(x => x.property)
    expect(properties).to.deep.equal(['address', 'contacts', 'name', 'profile'])
  })

  it('should create instance over an object with a path', () => {
    const sut = ObjectNavigator.from(person, 'profile.favorites.links')
    expect(sut.value).to.be.instanceOf(Array)
  })

  it('should navigate to immediate child property value', () => {
    const sut = ObjectNavigator.from(person)
    const name = sut.getValue<Name>('name')
    expect(name.first).to.equal('Joshua')
  })

  it('should get property ObjectNavigator', () => {
    const sut = ObjectNavigator.from(person)
    const profile = sut.get('profile')
    expect(profile).instanceof(ObjectNavigator)
  })

  it('should get property ObjectNavigator and match property name', () => {
    const sut = ObjectNavigator.from(person)
    const profile = sut.get('profile')
    expect(profile.property).equals('profile')
  })

  it('should navigate to deeply nested child property', () => {
    const sut = ObjectNavigator.from(person)
    const links = sut.get('profile.favorites.links')
    expect(links).to.not.equal(undefined)
    if (links) {
      expect(links.path).to.equal('profile.favorites')
    }
  })

  it('should be able to walk properties', () => {
    const sut = ObjectNavigator.from(person)
    const profile = sut.get('profile')
    const favorites = profile.get('favorites')
    expect(favorites.keys()).contains('links')
  })

  it('should re-create object structure', () => {
    const sut = ObjectNavigator.from(person)
    const result = sut.toObject()
    expect(person).to.deep.equal(result)
  })

  it('should recurse through object properties', () => {
    const sut = ObjectNavigator.from(person)
    const navigators: ObjectNavigator[] = []
    sut.recurse((_, nav) => navigators.push(nav))
    expect(navigators.length).equals(13)
  })

})
