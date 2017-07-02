const expect = require('chai').expect
const types = require('../lib')

describe('when using type parser', () => {
  const parser = types.TypeParser

  describe('parsing type strings', () => {
    it('should resolve type', () => {
      const typedef = parser.deserialize('string')
      expect(typedef.typebase).to.equal('String')
    })

    it('should resolve type with properties', () => {
      const typedef = parser.deserialize('email:max=128,min=32')
      expect(typedef.type).to.equal('email')
      expect(typedef.properties.max).to.equal(128)
      expect(typedef.properties.min).to.equal(32)
    })
  })

  describe('serializing type strings', () => {
    it('should serialize email type', () => {
      const typedef = types.Registry.resolve('email')
      const serialized = parser.serialize(typedef)
      expect(serialized).to.equal('email:max=254')
    })
  })
})
