const expect = require('chai').expect
const types = require('../lib')

describe('when using type parser', () => {
  const parser = types.TypeParser

  it('should throw error when deserializing unsupported types', () => {
    expect(() => parser.deserialize('string:required=yes')).to.throw(TypeError)
  })

  describe('parsing type strings', () => {
    it('should resolve type', () => {
      const typedef = parser.deserialize('string')
      expect(typedef.typebase).to.equal('String')
    })

    it('should resolve type with boolean properties', () => {
      const typedef = parser.deserialize('email:required=true')
      expect(typedef.type).to.equal('email')
      expect(typedef.properties.required).to.be.true
    })

    it('should resolve type with numeric properties', () => {
      const typedef = parser.deserialize('email:max=128,min=32')
      expect(typedef.type).to.equal('email')
      expect(typedef.properties.max).to.equal(128)
      expect(typedef.properties.min).to.equal(32)
    })

    it('should resolve type with default property override', () => {
      const typedef = parser.deserialize('email:128')
      expect(typedef.type).to.equal('email')
      expect(typedef.properties.max).to.equal(128)
    })
  })

  describe('serialization', () => {
    it('should serialize boolean type', () => {
      const typedef = types.Types.resolve('boolean')
      const serialized = parser.serialize(typedef)
      expect(serialized).to.equal('boolean')
    })

    it('should serialize complete boolean type', () => {
      const typedef = types.Types.resolve('boolean')
      const serialized = parser.serialize(typedef, true)
      expect(serialized).to.equal('boolean')
    })

    it('should serialize email type', () => {
      const typedef = types.Types.resolve('email')
      const serialized = parser.serialize(typedef)
      expect(serialized).to.equal('email:254')
    })

    it('should serialize complete email type', () => {
      const typedef = types.Types.resolve('email')
      const serialized = parser.serialize(typedef, true)
      expect(serialized).to.equal('email:max=254')
    })

    it('should serialize postalcode type', () => {
      const typedef = types.Types.resolve('postalcode')
      const serialized = parser.serialize(typedef)
      expect(serialized).to.equal('postalcode')
    })

    it('should serialize complete postalcode type', () => {
      const typedef = types.Types.resolve('postalcode')
      const serialized = parser.serialize(typedef, true)
      expect(serialized).to.equal('postalcode:max=16,min=5,required=true')
    })

    it('should serialize string type', () => {
      const typedef = types.Types.resolve('string')
      const serialized = parser.serialize(typedef)
      expect(serialized).to.equal('string')
    })

    it('should serialize complete string type', () => {
      const typedef = types.Types.resolve('string')
      const serialized = parser.serialize(typedef, true)
      expect(serialized).to.equal('string')
    })
  })
})
