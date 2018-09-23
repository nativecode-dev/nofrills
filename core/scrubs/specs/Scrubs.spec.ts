import 'mocha'

import { expect } from 'chai'
import { data } from './data'

import { scrub, Scrubs } from '../src/index'

describe('when using scrubs', () => {
  describe('creating a new Scrubs instance', () => {
    it('should call scrub with unknown type', async () => {
      const type: string = 'unknown-type-asshole'
      const scrubs: Scrubs = new Scrubs()
      const result = await scrubs.scrub(type, type)
      expect(result).to.equal(type)
    })
  })

  describe('the "scrub" function', () => {
    it('should echo null', async () => {
      const sut: any = await scrub(null)
      expect(sut).to.equal(null)
    })

    it('should echo undefined', async () => {
      const sut: any = await scrub(undefined)
      expect(sut).to.equal(undefined)
    })

    it('should echo array', async () => {
      const array: any[] = []
      const sut: any = await scrub(array)
      expect(sut).to.be.instanceOf(Array)
    })

    it('should echo boolean', async () => {
      const bool: boolean = true
      const sut: any = await scrub(bool)
      expect(sut).to.equal(true)
    })

    it('should echo date', async () => {
      const date: Date = new Date()
      const sut: any = await scrub(date)
      expect(sut).to.equal(date)
    })

    it('should echo function', async () => {
      const func = () => {
        return undefined
      }
      const sut: any = await scrub(func)
      expect(sut).to.equal(func)
    })

    it('should echo number', async () => {
      const num: number = 12345
      const sut: any = await scrub(num)
      expect(sut).to.equal(12345)
    })

    it('should secure url auth', async () => {
      const url: string = 'https://admin:password@nowhere.com'
      const sut: any = await scrub(url)
      expect(sut).to.equal('https://admin:<secured>@nowhere.com')
    })

    it('should secure url auth password', async () => {
      const url: string = 'https://:password@nowhere.com'
      const sut: any = await scrub(url)
      expect(sut).to.equal('https://:<secured>@nowhere.com')
    })

    it('should secure url query parameters', async () => {
      const url: string = 'https://nowhere.com?password=secret'
      const sut: any = await scrub(url)
      expect(sut).to.equal('https://nowhere.com?password=<secured>')
    })
  })

  describe('that has protected properties', () => {
    it('should replace property with secured option', async () => {
      const expectedUrl: string = 'https://nobody:<secured>@nowhere.com/?apikey=<secured>&password=<secured>'
      const sut: any = await scrub(data)
      expect(sut.user.email).to.equal(data.user.email)
      // expect(sut.user.password).to.equal('<secured>')
      expect(sut.strings).to.deep.equal([expectedUrl])
    })
  })
})
