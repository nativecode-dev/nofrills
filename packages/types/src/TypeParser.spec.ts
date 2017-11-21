import 'mocha'

import { expect } from 'chai'

import { Registry, Type, TypeParser } from './index'

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
  })

  describe('serialization', () => {
    it('should serialize boolean type', () => {
      const typedef: Type = Registry.resolve('boolean')
      const serialized = TypeParser.serialize(typedef)
      expect(serialized).to.equal('boolean')
    })

    it('should serialize complete boolean type', () => {
      const typedef: Type = Registry.resolve('boolean')
      const serialized = TypeParser.serialize(typedef, true)
      expect(serialized).to.equal('boolean')
    })

    it('should serialize email type', () => {
      const typedef: Type = Registry.resolve('email')
      const serialized = TypeParser.serialize(typedef)
      expect(serialized).to.equal('email:254')
    })

    it('should serialize complete email type', () => {
      const typedef: Type = Registry.resolve('email')
      const serialized = TypeParser.serialize(typedef, true)
      expect(serialized).to.equal('email:max=254')
    })

    it('should serialize postalcode type', () => {
      const typedef: Type = Registry.resolve('postalcode')
      const serialized = TypeParser.serialize(typedef)
      expect(serialized).to.equal('postalcode')
    })

    it('should serialize complete postalcode type', () => {
      const typedef: Type = Registry.resolve('postalcode')
      const serialized = TypeParser.serialize(typedef, true)
      expect(serialized).to.equal('postalcode:max=16,min=5,required=true')
    })

    it('should serialize string type', () => {
      const typedef: Type = Registry.resolve('string')
      const serialized = TypeParser.serialize(typedef)
      expect(serialized).to.equal('string')
    })

    it('should serialize complete string type', () => {
      const typedef: Type = Registry.resolve('string')
      const serialized = TypeParser.serialize(typedef, true)
      expect(serialized).to.equal('string')
    })

    it('should serialize partial type', () => {
      const typedef: Partial<Type> = {
        type: 'custom'
      }
      const serialized = TypeParser.serialize(typedef)
    })
  })
})
