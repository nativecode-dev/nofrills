import 'mocha'

import { expect } from 'chai'

import { Registry } from './Registry'
import { Type } from './Type'

describe('when using global TypeRegistry', () => {

  describe('when registering custom types', () => {

    it('should register type with no base type', () => {
      const type: Partial<Type> = { type: 'custom' }
      Registry.register(type)
      const typedef: Type = Registry.resolve(type.type || 'any')
      expect(typedef.typebase).to.equal('object')
    })

    it('should register empty type', () => {
      const type: Partial<Type> = {}
      Registry.register(type)
      const typedef: Type = Registry.resolve(type.type || 'any')
      expect(typedef.typebase).to.equal('object')
    })

  })


  describe('"Registry.from" function', () => {

    it('should return type array', () => expect(Registry.from([])).to.equal('array'))
    it('should return type boolean', () => expect(Registry.from(true)).to.equal('boolean'))
    it('should return type date', () => expect(Registry.from(new Date())).to.equal('date'))
    it('should return type error', () => expect(Registry.from(new TypeError())).to.equal('error'))
    it('should return type function', () => expect(Registry.from(() => void (0))).to.equal('function'))
    it('should return type number', () => expect(Registry.from(123)).to.equal('number'))
    it('should return type object', () => expect(Registry.from({})).to.equal('object'))
    it('should return type string', () => expect(Registry.from('string')).to.equal('string'))

  })

})
