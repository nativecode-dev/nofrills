const expect = require('chai').expect

const Is = require('../lib').Is
const Types = require('../lib').Types

describe('when using type library', () => {
  describe('"Is" functions', () => {
    describe('to validate value types', () => {
      it('should validate array type', () => {
        const array = []
        expect(Is.array(array)).to.be.true
      })

      it('should validate arrayOf type', () => {
        const array = [1, 2, 3, 4, 5]
        expect(Is.arrayOf(array, 'number')).to.be.true
      })

      it('should validate arrayOf are not expected type', () => {
        const array = [1, 2, 3, 4, '5']
        expect(Is.arrayOf(array, 'number')).to.be.false
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

      it('should validate date type', () => {
        const date = new Date()
        expect(Is.date(date)).to.be.true
      })

      it('should validate date is not string', () => {
        const date = 'yes'
        expect(Is.date(date)).to.be.false
      })

      it('should validate function', () => {
        const func = () => {}
        expect(Is.function(func)).to.be.true
      })

      it('should validate function is not a string', () => {
        const func = 'function'
        expect(Is.function(func)).to.be.false
      })

      it('should validate number type', () => {
        const num = 123
        expect(Is.number(num)).to.be.true
      })

      it('should validate number is not string', () => {
        const num = '123'
        expect(Is.number(num)).to.be.false
      })

      it('should validate object type', () => {
        const object = {}
        expect(Is.object(object)).to.be.true
      })

      it('should validate object is not a date', () => {
        const object = new Date()
        expect(Is.object(object)).to.be.false
      })

      it('should validate any value is of type any', () => {
        expect(Is.any([])).to.be.true
        expect(Is.any(true)).to.be.true
        expect(Is.any(new Date())).to.be.true
        expect(Is.any(new Error())).to.be.true
        expect(Is.any(123)).to.be.true
        expect(Is.any({})).to.be.true
        expect(Is.any('string')).to.be.true
      })
    })
  })

  describe('"Types.from" function', () => {
    it('should return type array', () => {
      const value = []
      expect(Types.from(value)).to.equal('array')
    })

    it('should return type boolean', () => {
      const value = true
      expect(Types.from(value)).to.equal('boolean')
    })

    it('should return type date', () => {
      const value = new Date()
      expect(Types.from(value)).to.equal('date')
    })

    it('should return type error', () => {
      const value = new TypeError()
      expect(Types.from(value)).to.equal('error')
    })

    it('should return type function', () => {
      const value = () => {}
      expect(Types.from(value)).to.equal('function')
    })

    it('should return type number', () => {
      const value = 123
      expect(Types.from(value)).to.equal('number')
    })

    it('should return type object', () => {
      const value = {}
      expect(Types.from(value)).to.equal('object')
    })

    it('should return type string', () => {
      const value = 'string'
      expect(Types.from(value)).to.equal('string')
    })
  })
})
