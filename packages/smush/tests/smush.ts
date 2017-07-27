import * as fs from 'fs'
import * as path from 'path'

import { expect } from 'chai'
import { Smush, SmushError } from '../src/index'

describe('smush', () => {
  let $S: Smush

  const readjson = (filename: string): any => {
    const filepath: string = path.resolve(filename)
    const buffer: Buffer = fs.readFileSync(filepath)
    const json: string = buffer.toString()
    return JSON.parse(json)
  }

  beforeEach(() => $S = new Smush())

  describe('when smushing', () => {
    const KEY: string = 'smushit'
    const PATH: string = 'realgood'

    it('should throw SmushError when file not found.', (done) => {
      $S.json(KEY, 'fake.file.json')
        .catch((error: SmushError) => {
          expect(error).to.be.instanceof(Error)
          done()
        })
    })

    it('should convert string to json and smush', (done) => {
      $S.string(KEY, JSON.stringify({}))
        .then((config: any) => {
          expect(config).to.be.instanceof(Object)
          done()
        })
        .catch((error: SmushError) => done(error))
    })

    it('should throw error if transformer throws', (done) => {
      const transformer = () => {
        throw new Error()
      }
      $S.string(KEY, JSON.stringify({}), transformer)
        .catch((error: SmushError) => {
          expect(error).to.be.instanceof(SmushError)
          done()
        })
    })

    it('should throw error for invalid JSON string', (done) => {
      $S.string(KEY, 'invalid')
        .then((config: any) => {
          done(config)
        })
        .catch((error: SmushError) => {
          expect(error).to.be.instanceof(SmushError)
          done()
        })
    })
  })

  describe('when merging two configurations', () => {
    const KEY: string = 'config'
    const PATH: string = 'smush.config'

    describe('should merge simple, one-level deep object', () => {
      const sourceA: any = {
        id: 'sourceA',
      }

      const sourceB: any = {
        id: 'sourceB',
      }

      it('uses last-in property setting', () => {
        const merged: any = $S.set(KEY, sourceA, sourceB)
        expect(merged).to.not.deep.equal(sourceA)
      })

      it('does override existing value', () => {
        const merged: any = $S.set(KEY, sourceA, sourceB)
        expect(merged).to.deep.equal(sourceB)
      })
    })

    describe('should merge complex, multi-level deep object', () => {
      const sourceA: any = {
        A: {
          name: 'A',
        },
        id: 'sourceA',
        numbers: [1, 7, 8, 9],
      }

      const sourceB: any = {
        B: {
          name: 'B',
        },
        id: 'sourceB',
        numbers: [2, 3, 4, 5, 6],
        payload: {
          key: 'sourceB.payload'
        }
      }

      const expected: any = {
        A: {
          name: 'A',
        },
        B: {
          name: 'B',
        },
        id: 'sourceB',
        numbers: [2, 3, 4, 5, 6],
        payload: {
          key: 'sourceB.payload',
        }
      }

      it('merges deeply nested properties', () => {
        const merged: any = $S.set(KEY, sourceA, sourceB)
        const sut: any = $S.toObject()[KEY]
        expect(sut).to.deep.equal(expected)
      })

      it('exports by specific key', () => {
        const merged: any = $S.set(KEY, sourceA, sourceB)
        const sut: any = $S.toObject(`${KEY}.payload`)
        expect(sut).to.deep.equal({
          key: 'sourceB.payload'
        })
      })

      it('exports by specific value', () => {
        const merged: any = $S.set(KEY, sourceA, sourceB)
        const sut: any = $S.toObject(`${KEY}.payload.key`)
        expect(sut).to.equal('sourceB.payload')
      })

      describe('should allow using dotted-paths', () => {
        it('setting and getting value', () => {
          const merged: any = $S.set(PATH, {
            id: 'dotted-path'
          })

          expect($S.get(PATH)).to.deep.equal(merged)
          expect($S.toObject()).to.deep.equal(merged)
        })
      })

      describe('should load .json files', () => {
        it('contents', (done) => {
          $S.json('config', './tests/test.simple.base.json')
            .then((smush: Smush) => smush.toObject().config)
            .then((config: any) => {
              const simpleBase: any = readjson('./tests/test.simple.base.json')
              expect(config).to.deep.equal(simpleBase)
              done()
            })
            .catch(done)
        })

        it('multiple instances', (done) => {
          $S.json('config', './tests/test.simple.base.json')
            .then((smush: Smush) => smush.json('config', './tests/test.simple.derived.json'))
            .then((smush: Smush) => smush.toObject().config)
            .then((config: any) => {
              const simpleMerged: any = readjson('./tests/test.simple.merged.json')
              expect(config).to.deep.equal(simpleMerged)
              done()
            })
            .catch(done)
        })

        it('transforms properties', (done) => {
          const transformer = (object: any) => {
            object.id = 'transformed'
            object.schema.name = 'transformed'
            return object
          }

          $S.json('config', './tests/test.simple.merged.json', transformer)
            .then((smush: Smush) => smush.toObject().config)
            .then((config: any) => {
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
