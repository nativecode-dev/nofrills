const expect = require('chai').expect
const types = require('../lib')

describe('when parsing type strings', () => {
  const parser = types.TypeParser

  describe('with type name only', () => {
    it('should resolve type', () => {
      const typedef = parser.convert('string')
      expect(typedef.typebase).to.equal('String')
    })

    it('should resolve type with properties', () => {
      const typedef = parser.convert('email:max=128,min=32')
      expect(typedef.type).to.equal('email')
      expect(typedef.properties.max).to.equal(128)
      expect(typedef.properties.min).to.equal(32)
    })
  })
})
