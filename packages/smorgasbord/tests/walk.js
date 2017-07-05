const expect = require('chai').expect

const Is = require('@nofrills/types').Is

const Dates = require('../lib').Dates
const Walk = require('../lib').Walk
const WalkType = require('../lib').WalkType

describe('when using Walk', () => {
  const context = require('./artifacts/context.walk')

  describe('to walk properties of an object', () => {
    const object = context.object
    const expected_members = context.expected.members

    it('should navigate all properties', () => {
      const members = []
      const interceptor = (type, value, path) => {
        if (type === WalkType.Object) {
          members.push(path.join('.'))
        }
      }
      const sut = Walk(object, interceptor)
      expect(members.length).to.deep.equal(7)
      expect(members).to.deep.equal(expected_members)
    })
  })

  describe('to walk arrays', () => {
    const elements = {
      today: {
        date: Dates.today()
      },
      tomorrow: {
        date: Dates.tomorrow()
      }
    }

    describe('of objects', () => {
      it('should walk object elements', () => {
        const array = [elements.today, elements.tomorrow]
        const members = []
        const interceptor = (type, value, path) => {
          if (type === WalkType.Object) {
            members.push(path.join('.'))
          }
        }
        const sut = Walk(array, interceptor)
        expect(sut).to.deep.equal(array)
        expect(members).to.deep.equal(['date', 'date'])
      })

      it('should walk array elements', () => {
        const array = [
          [elements.today],
          [elements.tomorrow]
        ]
        let count = 0
        const interceptor = (type, value) => {
          if (type === WalkType.Array && Is.array(value)) {
            count++
          }
        }
        const sut = Walk(array, interceptor)
        expect(count).to.equal(2)
      })
    })
  })

  describe('to walk other types', () => {
    it('should not walk array', () => {
      expect(Walk(context.array)).to.deep.equal(context.expected.array)
    })

    it('should not walk boolean', () => {
      expect(Walk(context.boolean)).to.equal(context.expected.boolean)
    })

    it('should not walk number', () => {
      expect(Walk(context.number)).to.equal(context.expected.number)
    })

    it('should not walk object', () => {
      expect(Walk(context.object)).to.deep.equal(context.object)
    })

    it('should not walk string', () => {
      expect(Walk(context.string)).to.equal(context.expected.string)
    })
  })
})
