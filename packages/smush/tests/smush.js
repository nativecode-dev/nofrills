const expect = require('chai').expect
const smush = require('../lib')

describe('smush', () => {
  let $S

  beforeEach(() => $S = new smush.Smush())

  describe('when smushing', () => {
    const KEY = 'smushit'
    const PATH = 'realgood'

    it('should throw SmushError when file not found.', (done) => {
      $S.json(KEY, 'fake.file.json')
        .catch(error => {
          expect(error).to.be.instanceof(Error)
          done()
        })
    })

    it('should convert string to json and smush', (done) => {
      $S.string(KEY, JSON.stringify({}))
        .then(config => {
          expect(config).to.be.instanceof(Object)
          done()
        })
        .catch(error => done(error))
    })

    it('should throw error if transformer throws', (done) => {
      const transformer = () => {
        throw new Error()
      }
      $S.string(KEY, JSON.stringify({}), transformer)
        .catch(error => {
          expect(error).to.be.instanceof(smush.SmushError)
          done()
        })
    })

    it('should throw error for invalid JSON string', (done) => {
      $S.string(KEY, 'invalid')
        .then(config => {
          done(config)
        })
        .catch(error => {
          expect(error).to.be.instanceof(smush.SmushError)
          done()
        })
    })
  })

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
        const merged = $S.set(KEY, sourceA, sourceB)
        expect(merged).to.not.deep.equal(sourceA)
      })

      it('does override existing value', () => {
        const merged = $S.set(KEY, sourceA, sourceB)
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
        numbers: [2, 3, 4, 5, 6],
        payload: {
          key: 'sourceB.payload',
        }
      }

      it('merges deeply nested properties', () => {
        const merged = $S.set(KEY, sourceA, sourceB)
        const sut = $S.toObject()[KEY]
        expect(sut).to.deep.equal(expected)
      })

      it('exports by specific key', () => {
        const merged = $S.set(KEY, sourceA, sourceB)
        const sut = $S.toObject(`${KEY}.payload`)
        expect(sut).to.deep.equal({
          key: 'sourceB.payload'
        })
      })

      it('exports by specific value', () => {
        const merged = $S.set(KEY, sourceA, sourceB)
        const sut = $S.toObject(`${KEY}.payload.key`)
        expect(sut).to.equal('sourceB.payload')
      })

      describe('should allow using dotted-paths', () => {
        it('setting and getting value', () => {
          const merged = $S.set(PATH, {
            id: 'dotted-path'
          })

          expect($S.get(PATH)).to.deep.equal(merged)
          expect($S.toObject()).to.deep.equal(merged)
        })
      })

      describe('should load .json files', () => {
        it('contents', (done) => {
          $S.json('config', './tests/test.simple.base.json')
            .then(smush => smush.toObject().config)
            .then(config => {
              const expected = require('./test.simple.base.json')
              expect(config).to.deep.equal(expected)
              done()
            })
            .catch(done)
        })

        it('multiple instances', (done) => {
          $S.json('config', './tests/test.simple.base.json')
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

          $S.json('config', './tests/test.simple.merged.json', transformer)
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
