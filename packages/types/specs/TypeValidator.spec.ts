import 'mocha'

import { expect } from 'chai'

import { Type, Types } from '../src/index'

describe('when using types library for validation', () => {
  const testtype: Partial<Type> = {
    properties: {
      max: 5,
      min: 2,
      required: true,
    },
    type: 'test',
    typebase: 'string',
    validator: (value) => Types.resolve('string').validator(value, testtype.properties)
  }

  Types.register(testtype)

  describe('to validate primitive values', () => {

    it('should validate value is a any', () => {
      expect(Types.validate([], 'any')).to.equal(true)
      expect(Types.validate(true, 'any')).to.equal(true)
      expect(Types.validate(new Date(), 'any')).to.equal(true)
      expect(Types.validate(new Error(), 'any')).to.equal(true)
      expect(Types.validate(123, 'any')).to.equal(true)
      expect(Types.validate({}, 'any')).to.equal(true)
      expect(Types.validate('string', 'any')).to.equal(true)
      expect(Types.validate(null, 'any')).to.equal(true)
      expect(Types.validate(undefined, 'any')).to.equal(true)
    })

    it('should validate value is an array', () => expect(Types.validate([1, 2, 3], 'array')).to.equal(true))

    it('should validate value is NOT an array', () => {
      expect(Types.validate(Date.now(), 'array')).to.equal(false)
      expect(Types.validate('123', 'array')).to.equal(false)
      expect(Types.validate(false, 'array')).to.equal(false)
      expect(Types.validate(null, 'array')).to.equal(false)
      expect(Types.validate(undefined, 'array')).to.equal(false)
    })

    it('should validate value is a boolean', () => {
      expect(Types.validate(false, 'boolean')).to.equal(true)
      expect(Types.validate(true, 'boolean')).to.equal(true)
    })

    it('should validate value is NOT a boolean', () => {
      expect(Types.validate(Date.now(), 'boolean')).to.equal(false)
      expect(Types.validate('123', 'boolean')).to.equal(false)
      expect(Types.validate(123, 'boolean')).to.equal(false)
      expect(Types.validate(null, 'boolean')).to.equal(false)
      expect(Types.validate(undefined, 'boolean')).to.equal(false)
    })

    it('should validate value is a date', () => expect(Types.validate(new Date(), 'date')).to.equal(true))

    it('should validate value is NOT a date', () => {
      expect(Types.validate(Date.now(), 'date')).to.equal(false)
      expect(Types.validate('123', 'date')).to.equal(false)
      expect(Types.validate([1, 2, 3], 'date')).to.equal(false)
      expect(Types.validate(null, 'date')).to.equal(false)
      expect(Types.validate(undefined, 'date')).to.equal(false)
    })

    it('should validate value is an error', () => expect(Types.validate(new Error(), 'error')).to.equal(true))

    it('should validate value is NOT an error', () => {
      expect(Types.validate(new Date(), 'error')).to.equal(false)
      expect(Types.validate('123', 'error')).to.equal(false)
      expect(Types.validate(123, 'error')).to.equal(false)
      expect(Types.validate(null, 'error')).to.equal(false)
      expect(Types.validate(undefined, 'error')).to.equal(false)
    })

    it('should validate value is a number', () => expect(Types.validate(123, 'number')).to.equal(true))

    it('should validate value is NOT a number', () => {
      expect(Types.validate(new Date(), 'number')).to.equal(false)
      expect(Types.validate('123', 'number')).to.equal(false)
      expect(Types.validate([1, 2, 3], 'number')).to.equal(false)
      expect(Types.validate(null, 'number')).to.equal(false)
      expect(Types.validate(undefined, 'number')).to.equal(false)
    })

    it('should validate value is an object', () => expect(Types.validate({}, 'object')).to.equal(true))

    it('should validate value is NOT an object', () => {
      expect(Types.validate(new Date(), 'object')).to.equal(false)
      expect(Types.validate(false, 'object')).to.equal(false)
      expect(Types.validate('123', 'object')).to.equal(false)
      expect(Types.validate(123, 'object')).to.equal(false)
      expect(Types.validate(null, 'object')).to.equal(false)
      expect(Types.validate(undefined, 'object')).to.equal(false)
    })

    it('should validate value is a phone', () => {
      expect(Types.validate('(666) 666-6969', 'phone')).to.equal(true)
      expect(Types.validate('666-666-6969', 'phone')).to.equal(true)
      expect(Types.validate('6666666969', 'phone')).to.equal(true)
      expect(Types.validate(6666666969, 'phone')).to.equal(true)
    })

    it('should validate value is NOT a phone', () => {
      expect(Types.validate(false, 'phone')).to.equal(false)
      expect(Types.validate('string', 'phone')).to.equal(false)
      expect(Types.validate(null, 'phone')).to.equal(false)
      expect(Types.validate(undefined, 'phone')).to.equal(false)
    })

    it('should validate value is a string', () => expect(Types.validate('string', 'string')).to.equal(true))

    it('should validate value is NOT a string', () => {
      expect(Types.validate(Date.now(), 'string')).to.equal(false)
      expect(Types.validate([1, 2, 3], 'string')).to.equal(false)
      expect(Types.validate(false, 'string')).to.equal(false)
      expect(Types.validate(null, 'string')).to.equal(false)
      expect(Types.validate(undefined, 'string')).to.equal(false)
    })

    it('should validate value is a timestamp', () => expect(Types.validate(Date.now(), 'timestamp')).to.equal(true))

    it('should validate value is NOT a timestamp', () => {
      expect(Types.validate(new Date(), 'timestamp')).to.equal(false)
      expect(Types.validate([1, 2, 3], 'timestamp')).to.equal(false)
      expect(Types.validate(false, 'timestamp')).to.equal(false)
      expect(Types.validate(null, 'timestamp')).to.equal(false)
      expect(Types.validate(undefined, 'timestamp')).to.equal(false)
    })

    it('should validate string value is null', () => expect(Types.validate(null, 'test')).to.equal(false))
    it('should validate string value is undefined', () => expect(Types.validate(undefined, 'test')).to.equal(false))

    it('should validate timestamp is null', () => expect(Types.validate(null, 'timestamp')).to.equal(false))
    it('should validate timestamp is undefined', () => expect(Types.validate(undefined, 'timestamp')).to.equal(false))
    it('should validate timestamp is within range', () => expect(Types.validate(Date.now(), 'timestamp')).to.equal(true))
    it('should validate timestamp is larger than lower bounds', () => expect(Types.validate(-8640000000000001, 'timestamp')).to.equal(false))
    it('should validate timestamp is larger than upper bounds', () => expect(Types.validate(8640000000000001, 'timestamp')).to.equal(false))

  })

  describe('to validate custom type values', () => {

    it('should validate value is an email', () => expect(Types.validate('nobody@nowhere.com', 'email')).to.equal(true))

    it('should validate value is NOT an email', () => {
      expect(Types.validate(Date.now(), 'email')).to.equal(false)
      expect(Types.validate('@nowhere.com', 'email')).to.equal(false)
      expect(Types.validate(false, 'email')).to.equal(false)
      expect(Types.validate(null, 'email')).to.equal(false)
      expect(Types.validate(undefined, 'email')).to.equal(false)
    })

    it('should validate value is a postal code', () => expect(Types.validate('12345-1234', 'postalcode')).to.equal(true))

    it('should validate value is NOT a postal code', () => {
      expect(Types.validate(new Date(), 'postalcode')).to.equal(false)
      expect(Types.validate('12345-awacs', 'postalcode')).to.equal(false)
      expect(Types.validate('12345-awacs-awacs', 'postalcode')).to.equal(false)
      expect(Types.validate(false, 'postalcode')).to.equal(false)
      expect(Types.validate(null, 'postalcode')).to.equal(false)
      expect(Types.validate(undefined, 'postalcode')).to.equal(false)
    })

    it('should validate string value length is invalid', () => {
      expect(Types.validate('a', 'test')).to.equal(false)
      expect(Types.validate('aaaaaa', 'test')).to.equal(false)
    })

  })

})
