import * as mocha from 'mocha'

import { expect } from 'chai'
import { scrub, Scrubs } from '../src/index'
import { data } from './artifacts/data'

describe('when using scrubs', () => {
  describe('the "scrub" function', () => {
    it('should echo null', () => {
      const sut: any = scrub(null)
      expect(sut).to.equal(null)
    })

    it('should echo undefined', () => {
      const sut: any = scrub(undefined)
      expect(sut).to.equal(undefined)
    })

    it('should echo array', () => {
      const array: any[] = []
      const sut: any = scrub(array)
      expect(sut).to.be.instanceOf(Array)
    })

    it('should echo boolean', () => {
      const bool: boolean = true
      const sut: any = scrub(bool)
      expect(sut).to.equal(true)
    })

    it('should echo date', () => {
      const date: Date = new Date()
      const sut: any = scrub(date)
      expect(sut).to.equal(date)
    })

    it('should echo function', () => {
      const func = () => {
        return undefined
      }
      const sut: any = scrub(func)
      expect(sut).to.equal(func)
    })

    it('should echo number', () => {
      const num: number = 12345
      const sut: any = scrub(num)
      expect(sut).to.equal(12345)
    })

    it('should secure url auth', () => {
      const url: string = 'https://admin:password@nowhere.com'
      const sut: any = scrub(url)
      expect(sut).to.equal('https://admin:<secured>@nowhere.com')
    })

    it('should secure url query parameters', () => {
      const url: string = 'https://nowhere.com?password=secret'
      const sut: any = scrub(url)
      expect(sut).to.equal('https://nowhere.com?password=<secured>')
    })
  })

  describe('that has protected properties', () => {
    it('should replace property with secured option', () => {
      const expectedUrl: string = 'https://nobody:<secured>@nowhere.com/?apikey=<secured>&password=<secured>'
      const sut: any = scrub(data)
      expect(sut.user.email).to.equal(data.user.email)
      expect(sut.user.password).to.equal('<secured>')
      expect(sut.strings).to.deep.equal([expectedUrl])
    })
  })
})
