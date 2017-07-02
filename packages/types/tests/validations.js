const expect = require('chai').expect
const types = require('../lib')

describe('when using types library for validation', () => {
  describe('to validate primitive values', () => {
    it('should validate value is an array', () => {
      const typedef = types.Registry.resolve('array')
      expect(typedef.validator([1, 2, 3])).to.be.true
      expect(types.Registry.validate([1, 2, 3], 'array')).to.be.true
    })
    it('should validate value is NOT an array', () => {
      const typedef = types.Registry.resolve('array')
      expect(typedef.validator(Date.now())).to.be.false
      expect(typedef.validator('123')).to.be.false
      expect(typedef.validator(false)).to.be.false
    })

    it('should validate value is a boolean', () => {
      const typedef = types.Registry.resolve('boolean')
      expect(typedef.validator(false)).to.be.true
      expect(types.Registry.validate(false, 'boolean')).to.be.true
    })
    it('should validate value is NOT a boolean', () => {
      const typedef = types.Registry.resolve('boolean')
      expect(typedef.validator(Date.now())).to.be.false
      expect(typedef.validator('123')).to.be.false
      expect(typedef.validator(123)).to.be.false
    })

    it('should validate value is a date', () => {
      const typedef = types.Registry.resolve('date')
      expect(typedef.validator(new Date())).to.be.true
      expect(types.Registry.validate(new Date(), 'date')).to.be.true
    })
    it('should validate value is NOT a date', () => {
      const typedef = types.Registry.resolve('date')
      expect(typedef.validator(Date.now())).to.be.false
      expect(typedef.validator('123')).to.be.false
      expect(typedef.validator([1, 2, 3])).to.be.false
    })

    it('should validate value is an error', () => {
      const typedef = types.Registry.resolve('error')
      expect(typedef.validator(new Error())).to.be.true
      expect(types.Registry.validate(new Error(), 'error')).to.be.true
    })
    it('should validate value is NOT an error', () => {
      const typedef = types.Registry.resolve('error')
      expect(typedef.validator(new Date())).to.be.false
      expect(typedef.validator('123')).to.be.false
      expect(typedef.validator(123)).to.be.false
    })

    it('should validate value is a number', () => {
      const typedef = types.Registry.resolve('number')
      expect(typedef.validator(123)).to.be.true
      expect(types.Registry.validate(123, 'number')).to.be.true
    })
    it('should validate value is NOT a number', () => {
      const typedef = types.Registry.resolve('number')
      expect(typedef.validator(new Date())).to.be.false
      expect(typedef.validator('123')).to.be.false
      expect(typedef.validator([1, 2, 3])).to.be.false
    })

    it('should validate value is an object', () => {
      const typedef = types.Registry.resolve('object')
      expect(typedef.validator({})).to.be.true
      expect(typedef.validator(new Date())).to.be.true
      expect(types.Registry.validate({}, 'object')).to.be.true
      expect(types.Registry.validate(new Date(), 'object')).to.be.true
    })
    it('should validate value is NOT an object', () => {
      const typedef = types.Registry.resolve('object')
      expect(typedef.validator(false)).to.be.false
      expect(typedef.validator('123')).to.be.false
      expect(typedef.validator(123)).to.be.false
    })

    it('should validate value is a string', () => {
      const typedef = types.Registry.resolve('string')
      expect(typedef.validator('string')).to.be.true
      expect(types.Registry.validate('string', 'string')).to.be.true
    })
    it('should validate value is NOT a string', () => {
      const typedef = types.Registry.resolve('string')
      expect(typedef.validator(Date.now())).to.be.false
      expect(typedef.validator([1, 2, 3])).to.be.false
      expect(typedef.validator(false)).to.be.false
    })

    it('should validate value is a timestamp', () => {
      const typedef = types.Registry.resolve('timestamp')
      expect(typedef.validator(Date.now())).to.be.true
      expect(types.Registry.validate(Date.now(), 'timestamp')).to.be.true
    })
    it('should validate value is NOT a timestamp', () => {
      const typedef = types.Registry.resolve('timestamp')
      expect(typedef.validator(new Date())).to.be.false
      expect(typedef.validator([1, 2, 3])).to.be.false
      expect(typedef.validator(false)).to.be.false
    })
  })

  describe('to validate custom type values', () => {
    it('should validate value is an email', () => {
      const typedef = types.Registry.resolve('email')
      expect(typedef.validator('nobody@nowhere.com')).to.be.true
      expect(types.Registry.validate('nobody@nowhere.com', 'email')).to.be.true
    })
    it('should validate value is NOT an email', () => {
      const typedef = types.Registry.resolve('email')
      expect(typedef.validator(Date.now())).to.be.false
      expect(typedef.validator('@nowhere.com')).to.be.false
      expect(typedef.validator(false)).to.be.false
    })

    it('should validate value is a postal code', () => {
      const typedef = types.Registry.resolve('postalcode')
      expect(typedef.validator('12345-1234')).to.be.true
      expect(types.Registry.validate('12345-1234', 'postalcode')).to.be.true
    })
    it('should validate value is NOT a postal code', () => {
      const typedef = types.Registry.resolve('postalcode')
      expect(typedef.validator(Date.now())).to.be.false
      expect(typedef.validator('12345a')).to.be.false
      expect(typedef.validator(false)).to.be.false
    })
  })

})
