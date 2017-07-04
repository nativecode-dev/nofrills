const expect = require('chai').expect

const Is = require('../').Is

describe('when using "Is" functions', () => {
  describe('to validate value types', () => {
    it('should validate array type', () => {
      const array = []
      expect(Is.array(array)).to.be.true
    })

    it('should validate string is not array', () => {
      const string = 'string'
      expect(Is.array(string)).to.be.false
    })

    it('should validate boolean type', () => {
      const bool = true
      expect(Is.boolean(bool)).to.be.true
    })

    it('should validate boolean is not string', () => {
      const bool = 'yes'
      expect(Is.boolean(bool)).to.be.false
    })

    it('should validate number type', () => {
      const num = 123
      expect(Is.number(num)).to.be.true
    })

    it('should validate number is not string', () => {
      const num = '123'
      expect(Is.number(num)).to.be.false
    })
  })
})
