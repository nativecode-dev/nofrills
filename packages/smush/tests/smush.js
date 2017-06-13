const expect = require('chai').expect
const Smush = require('../lib/smush').Smush

describe('smush', () => {
  let smush

  beforeEach(() => smush = new Smush())

  describe('when merging two configurations', () => {
    const KEY = 'config'
    const PATH = 'smush.config'

    describe('should merge simple, one-level deep object', () => {
      const sourceA = {
        id: 'sourceA',
      }
      const sourceB = {
        id: 'sourceB',
      }

      it('uses last-in property setting', () => {
        const merged = smush.set(KEY, sourceA, sourceB)
        expect(merged).to.not.deep.equal(sourceA)
      })

      it('does override existing value', () => {
        const merged = smush.set(KEY, sourceA, sourceB)
        expect(merged).to.deep.equal(sourceB)
      })
    })

    describe('should merge complex, multi-level deep object', () => {
      const sourceA = {
        id: 'sourceA',
        A: {
          name: 'A',
        },
        numbers: [1, 7, 8, 9],
      }

      const sourceB = {
        id: 'sourceB',
        B: {
          name: 'B',
        },
        numbers: [2, 3, 4, 5, 6],
        payload: {
          key: 'sourceB.payload'
        }
      }

      it('merges deeply nested properties', () => {
        const merged = smush.set(KEY, sourceA, sourceB)

        expect(merged.A).to.not.be.undefined
        expect(merged.A.name).to.equal('A')

        expect(merged.B).to.not.be.undefined
        expect(merged.B.name).to.equal('B')

        expect(merged.numbers).to.deep.equal([2, 3, 4, 5, 6])
        expect(merged.payload.key).to.equal('sourceB.payload')
      })
    })

    describe('should allow using dotted-paths', () => {
      it('setting and getting value', () => {
        const merged = smush.set(PATH, {
          id: 'dotted-path'
        })

        expect(smush.get(PATH)).to.deep.equal(merged)
        expect(smush.toObject()).to.deep.equal(merged)
      })
    })

    describe('should load .json files', () => {
      it('loads contents', (done) => {
        smush.json('config', './tests/test.simple.base.json')
          .then(smush => smush.toObject().config)
          .then(config => {
            const expected = require('./test.simple.base.json')
            expect(config).to.deep.equal(expected)
            done()
          })
          .catch(error => done(error))
      })

      it('loads multiple content files', (done) => {
        smush.json('config', './tests/test.simple.base.json')
          .then(smush => smush.json('config', './tests/test.simple.derived.json'))
          .then(smush => smush.toObject().config)
          .then(config => {
            const expected = require('./test.simple.merged.json')
            expect(config).to.deep.equal(expected)
            done()
          })
          .catch(error => done(error))
      })
    })
  })
})
