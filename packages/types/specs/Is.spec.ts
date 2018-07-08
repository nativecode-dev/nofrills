import 'mocha'

import { expect } from 'chai'

import { Is } from '@nofrills/types'

describe('when using type library', () => {

  describe('"Is" module', () => {

    describe('to validate types', () => {

      it('should validate array type', () => expect(Is.array([])).to.equal(true))
      it('should validate arrayOf type', () => expect(Is.arrayOf([1, 2, 3, 4, 5], 'number')).to.equal(true))
      it('should validate arrayOf are not expected type', () => expect(Is.arrayOf([1, 2, 3, 4, '5'], 'number')).to.equal(false))
      it('should validate arrayOf any', () => expect(Is.arrayOf([1])).to.equal(true))
      it('should validate string is not array', () => expect(Is.array('string')).to.equal(false))
      it('should validate boolean type', () => expect(Is.boolean(true)).to.equal(true))
      it('should validate boolean is not string', () => expect(Is.boolean('yes')).to.equal(false))
      it('should validate date type', () => expect(Is.date(new Date())).to.equal(true))
      it('should validate date is not string', () => expect(Is.date('yes')).to.equal(false))
      it('should validate function', () => expect(Is.function(() => void (0))).to.equal(true))
      it('should validate function is not a string', () => expect(Is.function('function')).to.equal(false))
      it('should validate number type', () => expect(Is.number(123)).to.equal(true))
      it('should validate number is not string', () => expect(Is.number('123')).to.equal(false))
      it('should validate object type', () => expect(Is.object({})).to.equal(true))
      it('should validate object is not a date', () => expect(Is.object(new Date())).to.equal(false))
    })

    it('should validate any value is of type any', () => {
      expect(Is.any([])).to.equal(true)
      expect(Is.any(true)).to.equal(true)
      expect(Is.any(new Date())).to.equal(true)
      expect(Is.any(new Error())).to.equal(true)
      expect(Is.any(123)).to.equal(true)
      expect(Is.any({})).to.equal(true)
      expect(Is.any('string')).to.equal(true)
    })

  })

})
