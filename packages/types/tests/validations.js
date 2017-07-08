const expect = require('chai').expect
const types = require('../lib')

describe('when using types library for validation', () => {
  const LongEmailString = [].fill('a', 1, 1024).join('')
  const validate = types.Registry.validate

  describe('to validate primitive values', () => {
    it('should validate value is a any', () => {
      expect(validate([], 'any')).to.be.true
      expect(validate(true, 'any')).to.be.true
      expect(validate(new Date(), 'any')).to.be.true
      expect(validate(new Error(), 'any')).to.be.true
      expect(validate(123, 'any')).to.be.true
      expect(validate({}, 'any')).to.be.true
      expect(validate('string', 'any')).to.be.true
    })

    it('should validate value is an array', () => {
      expect(validate([1, 2, 3], 'array')).to.be.true
    })
    it('should validate value is NOT an array', () => {
      expect(validate(Date.now(), 'array')).to.be.false
      expect(validate('123', 'array')).to.be.false
      expect(validate(false, 'array')).to.be.false
    })

    it('should validate value is a boolean', () => {
      expect(validate(false, 'boolean')).to.be.true
      expect(validate(false, 'boolean')).to.be.true
    })
    it('should validate value is NOT a boolean', () => {
      expect(validate(Date.now(), 'boolean')).to.be.false
      expect(validate('123', 'boolean')).to.be.false
      expect(validate(123, 'boolean')).to.be.false
    })

    it('should validate value is a date', () => {
      expect(validate(new Date(), 'date')).to.be.true
    })
    it('should validate value is NOT a date', () => {
      expect(validate(Date.now(), 'date')).to.be.false
      expect(validate('123', 'date')).to.be.false
      expect(validate([1, 2, 3], 'date')).to.be.false
    })

    it('should validate value is an error', () => {
      expect(validate(new Error(), 'error')).to.be.true
    })
    it('should validate value is NOT an error', () => {
      expect(validate(new Date(), 'error')).to.be.false
      expect(validate('123', 'error')).to.be.false
      expect(validate(123, 'error')).to.be.false
    })

    it('should validate value is a number', () => {
      expect(validate(123, 'number')).to.be.true
    })
    it('should validate value is NOT a number', () => {
      expect(validate(new Date(), 'number')).to.be.false
      expect(validate('123', 'number')).to.be.false
      expect(validate([1, 2, 3], 'number')).to.be.false
    })

    it('should validate value is an object', () => {
      expect(validate({}, 'object')).to.be.true
    })
    it('should validate value is NOT an object', () => {
      expect(validate(new Date(), 'object')).to.be.false
      expect(validate(false, 'object')).to.be.false
      expect(validate('123', 'object')).to.be.false
      expect(validate(123, 'object')).to.be.false
    })

    it('should validate value is a phone', () => {
      expect(validate('(666) 666-6969', 'phone')).to.be.true
      expect(validate('666-666-6969', 'phone')).to.be.true
      expect(validate('6666666969', 'phone')).to.be.true
      expect(validate(6666666969, 'phone')).to.be.true
    })
    it('should validate value is NOT a phone', () => {
      expect(validate(false, 'phone')).to.be.false
      expect(validate('string', 'phone')).to.be.false
    })

    it('should validate value is a string', () => {
      expect(validate('string', 'string')).to.be.true
    })
    it('should validate value is NOT a string', () => {
      expect(validate(Date.now(), 'string')).to.be.false
      expect(validate([1, 2, 3], 'string')).to.be.false
      expect(validate(false, 'string')).to.be.false
    })

    it('should validate value is a timestamp', () => {
      expect(validate(Date.now(), 'timestamp')).to.be.true
    })
    it('should validate value is NOT a timestamp', () => {
      expect(validate(new Date(), 'timestamp')).to.be.false
      expect(validate([1, 2, 3], 'timestamp')).to.be.false
      expect(validate(false, 'timestamp')).to.be.false
    })
  })

  describe('to validate custom type values', () => {
    it('should validate value is an email', () => {
      expect(validate('nobody@nowhere.com', 'email')).to.be.true
    })
    it('should validate value is NOT an email', () => {
      expect(validate(Date.now(), 'email')).to.be.false
      expect(validate('@nowhere.com', 'email')).to.be.false
      expect(validate(false, 'email')).to.be.false
    })

    it('should validate value is a postal code', () => {
      expect(validate('12345-1234', 'postalcode')).to.be.true
    })
    it('should validate value is NOT a postal code', () => {
      expect(validate(Date.now(), 'postalcode')).to.be.false
      expect(validate('12345a', 'postalcode')).to.be.false
      expect(validate(false, 'postalcode')).to.be.false
    })

    it('should validate string value length is invalid', () => {
      expect(validate(LongEmailString, 'email')).to.be.false
    })
  })

})
