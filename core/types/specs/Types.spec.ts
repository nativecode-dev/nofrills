import 'mocha'

import { expect } from 'chai'

import { Type, Types } from '../src'

describe('when using global TypeRegistry', () => {
  describe('when registering custom types', () => {
    it('should register type with no base type', () => {
      const type: Partial<Type> = { type: 'custom' }
      Types.register(type)
      const typedef: Type = Types.resolve(type.type || 'any')
      expect(typedef.typebase).to.equal('object')
    })

    it('should register empty type', () => {
      const type: Partial<Type> = {}
      Types.register(type)
      const typedef: Type = Types.resolve(type.type || 'any')
      expect(typedef.typebase).to.equal('object')
    })
  })

  describe('"Types.from" function', () => {
    it('should return type array', () => expect(Types.from([])).to.equal('array'))
    it('should return type boolean', () => expect(Types.from(true)).to.equal('boolean'))
    it('should return type date', () => expect(Types.from(new Date())).to.equal('date'))
    it('should return type error', () => expect(Types.from(new TypeError())).to.equal('error'))
    it('should return type function', () => expect(Types.from(() => void 0)).to.equal('function'))
    it('should return type null', () => expect(Types.from(null)).to.equal('null'))
    it('should return type number', () => expect(Types.from(123)).to.equal('number'))
    it('should return type object', () => expect(Types.from({})).to.equal('object'))
    it('should return type string', () => expect(Types.from('string')).to.equal('string'))
    it('should return type undefined', () => expect(Types.from(undefined)).to.equal('undefined'))
  })
})
