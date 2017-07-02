const expect = require('chai').expect
const types = require('../lib')

describe('when using types library', () => {
  describe('to get type information', () => {
    it('should resolve array type', () => {
      const typedef = types.Registry.resolve('array')
      expect(typedef.typebase).to.equal('Array')
    })

    it('should resolve number type', () => {
      const typedef = types.Registry.resolve('number')
      expect(typedef.typebase).to.equal('Number')
    })

    it('should resolve string type', () => {
      const typedef = types.Registry.resolve('string')
      expect(typedef.typebase).to.equal('String')
    })
  })
})
