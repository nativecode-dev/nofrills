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

      const expected = {
        id: 'sourceB',
        A: {
          name: 'A',
        },
        B: {
          name: 'B',
        },
        numbers: [2, 3, 4, 5, 6, ],
        payload: {
          key: 'sourceB.payload',
        }
      }

      it('merges deeply nested properties', () => {
        const merged = smush.set(KEY, sourceA, sourceB)
        const sut = smush.toObject()[KEY]
        expect(sut).to.deep.equal(expected)
      })

      it('exports by specific key', () => {
        const merged = smush.set(KEY, sourceA, sourceB)
        const sut = smush.toObject(`${KEY}.payload`)
        expect(sut).to.deep.equal({
          key: 'sourceB.payload'
        })
      })

      it('exports by specific value', () => {
        const merged = smush.set(KEY, sourceA, sourceB)
        const sut = smush.toObject(`${KEY}.payload.key`)
        expect(sut).to.equal('sourceB.payload')
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
        it('contents', (done) => {
          smush.json('config', './tests/test.simple.base.json')
            .then(smush => smush.toObject().config)
            .then(config => {
              const expected = require('./test.simple.base.json')
              expect(config).to.deep.equal(expected)
              done()
            })
            .catch(done)
        })

        it('multiple instances', (done) => {
          smush.json('config', './tests/test.simple.base.json')
            .then(smush => smush.json('config', './tests/test.simple.derived.json'))
            .then(smush => smush.toObject().config)
            .then(config => {
              const expected = require('./test.simple.merged.json')
              expect(config).to.deep.equal(expected)
              done()
            })
            .catch(done)
        })

        it('transforms properties', (done) => {
          const transformer = (object) => {
            object.id = 'transformed'
            object.schema.name = 'transformed'
            return object
          }

          smush.json('config', './tests/test.simple.merged.json', transformer)
            .then(smush => smush.toObject().config)
            .then(config => {
              expect(config.id).to.equal('transformed')
              expect(config.schema.name).to.equal('transformed')
              done()
            })
            .catch(done)
        })
      })
    })
  })
})
