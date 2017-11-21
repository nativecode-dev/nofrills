import 'mocha'

import { expect } from 'chai'

import { Type, Types } from './index'

describe('when using types library for validation', () => {
  const validate: (value: any, type: string) => boolean = Types.validate
  const testtype: Partial<Type> = {
    properties: {
      max: 5,
      min: 2,
      required: true,
    },
    type: 'test',
    typebase: 'string',
    validator: (value) => {
      return Types.resolve('string').validator(value, testtype.properties)
    }
  }
  Types.register(testtype)

  describe('to validate primitive values', () => {

    it('should validate value is a any', () => {
      expect(validate([], 'any')).to.equal(true)
      expect(validate(true, 'any')).to.equal(true)
      expect(validate(new Date(), 'any')).to.equal(true)
      expect(validate(new Error(), 'any')).to.equal(true)
      expect(validate(123, 'any')).to.equal(true)
      expect(validate({}, 'any')).to.equal(true)
      expect(validate('string', 'any')).to.equal(true)
    })

    it('should validate value is an array', () => expect(validate([1, 2, 3], 'array')).to.equal(true))

    it('should validate value is NOT an array', () => {
      expect(validate(Date.now(), 'array')).to.equal(false)
      expect(validate('123', 'array')).to.equal(false)
      expect(validate(false, 'array')).to.equal(false)
    })

    it('should validate value is a boolean', () => {
      expect(validate(false, 'boolean')).to.equal(true)
      expect(validate(false, 'boolean')).to.equal(true)
    })

    it('should validate value is NOT a boolean', () => {
      expect(validate(Date.now(), 'boolean')).to.equal(false)
      expect(validate('123', 'boolean')).to.equal(false)
      expect(validate(123, 'boolean')).to.equal(false)
    })

    it('should validate value is a date', () => expect(validate(new Date(), 'date')).to.equal(true))

    it('should validate value is NOT a date', () => {
      expect(validate(Date.now(), 'date')).to.equal(false)
      expect(validate('123', 'date')).to.equal(false)
      expect(validate([1, 2, 3], 'date')).to.equal(false)
    })

    it('should validate value is an error', () => expect(validate(new Error(), 'error')).to.equal(true))

    it('should validate value is NOT an error', () => {
      expect(validate(new Date(), 'error')).to.equal(false)
      expect(validate('123', 'error')).to.equal(false)
      expect(validate(123, 'error')).to.equal(false)
    })

    it('should validate value is a number', () => expect(validate(123, 'number')).to.equal(true))

    it('should validate value is NOT a number', () => {
      expect(validate(new Date(), 'number')).to.equal(false)
      expect(validate('123', 'number')).to.equal(false)
      expect(validate([1, 2, 3], 'number')).to.equal(false)
    })

    it('should validate value is an object', () => expect(validate({}, 'object')).to.equal(true))

    it('should validate value is NOT an object', () => {
      expect(validate(new Date(), 'object')).to.equal(false)
      expect(validate(false, 'object')).to.equal(false)
      expect(validate('123', 'object')).to.equal(false)
      expect(validate(123, 'object')).to.equal(false)
    })

    it('should validate value is a phone', () => {
      expect(validate('(666) 666-6969', 'phone')).to.equal(true)
      expect(validate('666-666-6969', 'phone')).to.equal(true)
      expect(validate('6666666969', 'phone')).to.equal(true)
      expect(validate(6666666969, 'phone')).to.equal(true)
    })

    it('should validate value is NOT a phone', () => {
      expect(validate(false, 'phone')).to.equal(false)
      expect(validate('string', 'phone')).to.equal(false)
    })

    it('should validate value is a string', () => expect(validate('string', 'string')).to.equal(true))

    it('should validate value is NOT a string', () => {
      expect(validate(Date.now(), 'string')).to.equal(false)
      expect(validate([1, 2, 3], 'string')).to.equal(false)
      expect(validate(false, 'string')).to.equal(false)
    })

    it('should validate value is a timestamp', () => expect(validate(Date.now(), 'timestamp')).to.equal(true))

    it('should validate value is NOT a timestamp', () => {
      expect(validate(new Date(), 'timestamp')).to.equal(false)
      expect(validate([1, 2, 3], 'timestamp')).to.equal(false)
      expect(validate(false, 'timestamp')).to.equal(false)
    })
  })

  describe('to validate custom type values', () => {

    it('should validate value is an email', () => expect(validate('nobody@nowhere.com', 'email')).to.equal(true))

    it('should validate value is NOT an email', () => {
      expect(validate(Date.now(), 'email')).to.equal(false)
      expect(validate('@nowhere.com', 'email')).to.equal(false)
      expect(validate(false, 'email')).to.equal(false)
    })

    it('should validate value is a postal code', () => expect(validate('12345-1234', 'postalcode')).to.equal(true))

    it('should validate value is NOT a postal code', () => {
      expect(validate(new Date(), 'postalcode')).to.equal(false)
      expect(validate('12345?abasddks', 'postalcode')).to.equal(false)
      expect(validate(false, 'postalcode')).to.equal(false)
    })

    it('should validate string value length is invalid', () => {
      expect(validate('a', 'test')).to.equal(false)
      expect(validate('aaaaaa', 'test')).to.equal(false)
    })

    it('should validate string value length is required', () => expect(validate(null, 'test')).to.equal(false))

  })

})
