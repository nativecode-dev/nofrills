import 'mocha'

import { expect } from 'chai'

import { Type, Types, TypeParser } from './index'

describe('when using type parser', () => {
  it('should throw error when deserializing unsupported types', () => {
    expect(() => TypeParser.deserialize('string:required=yes')).to.throw(TypeError)
  })

  describe('parsing type strings', () => {

    it('should resolve type', () => {
      const typedef: Type = TypeParser.deserialize('string')
      expect(typedef.typebase).to.equal('String')
    })

    it('should resolve type with boolean properties', () => {
      const typedef: Type = TypeParser.deserialize('email:required=true')
      expect(typedef.type).to.equal('email')
      expect(typedef.properties.required).to.equal(true)
    })

    it('should resolve type with numeric properties', () => {
      const typedef: Type = TypeParser.deserialize('email:max=128,min=32')
      expect(typedef.type).to.equal('email')
      expect(typedef.properties.max).to.equal(128)
      expect(typedef.properties.min).to.equal(32)
    })

    it('should resolve type with default property override', () => {
      const typedef: Type = TypeParser.deserialize('email:128')
      expect(typedef.type).to.equal('email')
      expect(typedef.properties.max).to.equal(128)
    })

    it('should resolve type with constrained number', () => {
      const typedef: Type = TypeParser.deserialize('number:5')
      expect(typedef.properties.max).to.equal(5)
      expect(typedef.validator(1, typedef.properties)).to.equal(true)
      expect(typedef.validator(6, typedef.properties)).to.equal(false)
      expect(typedef.validator(5, typedef.properties)).to.equal(true)
    })

    it('should resolve type with bounded number', () => {
      const typedef: Type = TypeParser.deserialize('number:max=5,min=2')
      expect(typedef.properties.max).to.equal(5)
      expect(typedef.validator(1, typedef.properties)).to.equal(false)
      expect(typedef.validator(6, typedef.properties)).to.equal(false)
      expect(typedef.validator(5, typedef.properties)).to.equal(true)
    })

  })

  describe('serialization', () => {
    it('should serialize boolean type', () => {
      const typedef: Type = Types.resolve('boolean')
      const serialized = TypeParser.serialize(typedef)
      expect(serialized).to.equal('boolean')
    })

    it('should serialize complete boolean type', () => {
      const typedef: Type = Types.resolve('boolean')
      const serialized = TypeParser.serialize(typedef, true)
      expect(serialized).to.equal('boolean')
    })

    it('should serialize email type', () => {
      const typedef: Type = Types.resolve('email')
      const serialized = TypeParser.serialize(typedef)
      expect(serialized).to.equal('email:254')
    })

    it('should serialize complete email type', () => {
      const typedef: Type = Types.resolve('email')
      const serialized = TypeParser.serialize(typedef, true)
      expect(serialized).to.equal('email:max=254')
    })

    it('should serialize complete postalcode type', () => {
      const typedef: Type = Types.resolve('postalcode')
      const serialized = TypeParser.serialize(typedef, true)
      expect(serialized).to.equal('postalcode:max=16,min=5,required=true')
    })

    it('should serialize string type', () => {
      const typedef: Type = Types.resolve('string')
      const serialized = TypeParser.serialize(typedef)
      expect(serialized).to.equal('string')
    })

    it('should serialize complete string type', () => {
      const typedef: Type = Types.resolve('string')
      const serialized = TypeParser.serialize(typedef, true)
      expect(serialized).to.equal('string')
    })

    it('should serialize partial type', () => {
      const typedef: Partial<Type> = {
        properties: {
          max: 2,
        },
        type: 'custom'
      }
      const serialized = TypeParser.serialize(typedef)
      expect(serialized).to.equal('custom')
    })

    it('should serialize complete type', () => {
      const typedef: Partial<Type> = {
        properties: {
          max: 2,
          min: 2,
        },
        type: 'custom'
      }
      const serialized = TypeParser.serialize(typedef, true)
      expect(serialized).to.equal('custom:max=2,min=2')
    })
  })
})
