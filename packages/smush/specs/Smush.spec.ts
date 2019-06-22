import 'mocha'

import fs from 'fs'
import path from 'path'

import expect from './expect'

import { Smush } from '../src/index'

describe('smush', () => {
  let $S: Smush

  const readjson = (filename: string): any => {
    const filepath: string = path.resolve(filename)
    const buffer: Buffer = fs.readFileSync(filepath)
    const json: string = buffer.toString()
    return JSON.parse(json)
  }

  beforeEach(() => ($S = new Smush()))

  describe('when smushing', () => {
    const KEY: string = 'smushit'

    it('should throw SmushError when file not found.', () => {
      expect($S.json(KEY, 'fake.file.json')).to.eventually.be.rejected
    })

    it('should convert string to json and smush', async () => {
      const json = JSON.stringify({})
      const config = await $S.string(KEY, json)
      expect(config).to.be.instanceof(Object)
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
          key: 'sourceB.payload',
        },
      }

      const expected: any = {
        A: {
          name: 'A',
        },
        B: {
          name: 'B',
        },
        id: 'sourceB',
        numbers: [1, 7, 8, 9, 2, 3, 4, 5, 6],
        payload: {
          key: 'sourceB.payload',
        },
      }

      it('merges deeply nested properties', () => {
        $S.set(KEY, sourceA, sourceB)
        const sut: any = $S.toObject()[KEY]
        expect(sut).to.deep.equal(expected)
      })

      it('exports by specific key', () => {
        $S.set(KEY, sourceA, sourceB)
        const sut: any = $S.toObject(`${KEY}.payload`)
        expect(sut).to.deep.equal({
          key: 'sourceB.payload',
        })
      })

      it('exports by specific value', () => {
        $S.set(KEY, sourceA, sourceB)
        const sut: any = $S.toObject(`${KEY}.payload.key`)
        expect(sut).to.equal('sourceB.payload')
      })

      describe('should allow using dotted-paths', () => {
        it('setting and getting value', () => {
          const merged: any = $S.set(PATH, {
            id: 'dotted-path',
          })

          expect($S.get(PATH)).to.deep.equal(merged)
          expect($S.toObject()).to.deep.equal(merged)
        })
      })

      describe('should load .json files', () => {
        const base = path.join(__dirname, '../artifacts/test.simple.base.json')
        const derived = path.join(__dirname, '../artifacts/test.simple.derived.json')
        const merged = path.join(__dirname, '../artifacts/test.simple.merged.json')

        it('contents', async () => {
          const smush = await $S.json('config', base)
          const config = smush.toObject().config
          const simpleBase: any = readjson(base)
          expect(config).to.deep.equal(simpleBase)
        })

        it('multiple instances', async () => {
          const smush = await $S.json('config', base)
          const json = await smush.json('config', derived)
          const config = json.toObject().config
          const simpleMerged: any = readjson(merged)
          expect(config).to.deep.equal(simpleMerged)
        })

        it('transforms properties', async () => {
          const transformer = (object: any) => {
            object.id = 'transformed'
            object.schema.name = 'transformed'
            return object
          }

          const smush = await $S.json('config', merged, transformer)
          const config = smush.toObject().config
          expect(config.id).to.equal('transformed')
          expect(config.schema.name).to.equal('transformed')
        })
      })
    })
  })
})
