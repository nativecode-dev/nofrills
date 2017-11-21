import 'mocha'

import { expect } from 'chai'

import { Is } from './Is'
import { Registry } from './Registry'
import { Type } from './Type'

describe('when registering custom types', () => {
  it('should register with no typebase set', () => {
    const type: Partial<Type> = {
      type: 'custom'
    }
    Registry.register(type)
    const typedef: Type = Registry.resolve(type.type || 'any')
    expect(typedef.typebase).to.equal('object')
  })

  it('should register with no type set', () => {
    const type: Partial<Type> = {}
    Registry.register(type)
    const typedef: Type = Registry.resolve(type.type || 'any')
    expect(typedef.typebase).to.equal('object')
  })

  describe('when using type library', () => {
    describe('"Is" functions', () => {
      describe('to validate value types', () => {
        it('should validate array type', () => {
          const array: any[] = []
          expect(Is.array(array)).to.equal(true)
        })

        it('should validate arrayOf type', () => {
          const array: number[] = [1, 2, 3, 4, 5]
          expect(Is.arrayOf(array, 'number')).to.equal(true)
        })

        it('should validate arrayOf are not expected type', () => {
          const array: any[] = [1, 2, 3, 4, '5']
          expect(Is.arrayOf(array, 'number')).to.equal(false)
        })

        it('should validate string is not array', () => {
          const value: string = 'string'
          expect(Is.array(value)).to.equal(false)
        })

        it('should validate boolean type', () => {
          const bool: boolean = true
          expect(Is.boolean(bool)).to.equal(true)
        })

        it('should validate boolean is not string', () => {
          const bool: string = 'yes'
          expect(Is.boolean(bool)).to.equal(false)
        })

        it('should validate date type', () => {
          const date: Date = new Date()
          expect(Is.date(date)).to.equal(true)
        })

        it('should validate date is not string', () => {
          const date: string = 'yes'
          expect(Is.date(date)).to.equal(false)
        })

        it('should validate function', () => {
          const func = () => undefined
          expect(Is.function(func)).to.equal(true)
        })

        it('should validate function is not a string', () => {
          const func: string = 'function'
          expect(Is.function(func)).to.equal(false)
        })

        it('should validate number type', () => {
          const num: number = 123
          expect(Is.number(num)).to.equal(true)
        })

        it('should validate number is not string', () => {
          const num: string = '123'
          expect(Is.number(num)).to.equal(false)
        })

        it('should validate object type', () => {
          const object: object = {}
          expect(Is.object(object)).to.equal(true)
        })

        it('should validate object is not a date', () => {
          const object: Date = new Date()
          expect(Is.object(object)).to.equal(false)
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

    describe('"Registry.from" function', () => {
      it('should return type array', () => {
        const value: any[] = []
        expect(Registry.from(value)).to.equal('array')
      })

      it('should return type boolean', () => {
        const value: boolean = true
        expect(Registry.from(value)).to.equal('boolean')
      })

      it('should return type date', () => {
        const value: Date = new Date()
        expect(Registry.from(value)).to.equal('date')
      })

      it('should return type error', () => {
        const value: TypeError = new TypeError()
        expect(Registry.from(value)).to.equal('error')
      })

      it('should return type function', () => {
        const value = () => {
          return
        }
        expect(Registry.from(value)).to.equal('function')
      })

      it('should return type number', () => {
        const value: number = 123
        expect(Registry.from(value)).to.equal('number')
      })

      it('should return type object', () => {
        const value: object = {}
        expect(Registry.from(value)).to.equal('object')
      })

      it('should return type string', () => {
        const value: string = 'string'
        expect(Registry.from(value)).to.equal('string')
      })
    })
  })

})
