const expect = require('chai').expect
const scrubs = require('../lib')

describe('when using scrubs', () => {
  const root = require('./artifacts/data.json')

  describe('the "scrub" function', () => {
    it('should echo boolean', () => {
      const bool = true
      const sut = scrubs.scrub(bool)
      expect(sut).to.be.true
    })

    it('should echo date', () => {
      const date = new Date()
      const sut = scrubs.scrub(date)
      expect(sut).to.equal(date)
    })

    it('should echo function', () => {
      const func = () => {}
      const sut = scrubs.scrub(func)
      expect(sut).to.equal(func)
    })

    it('should echo number', () => {
      const num = 12345
      const sut = scrubs.scrub(num)
      expect(sut).to.equal(12345)
    })

    it('should secure url auth', () => {
      const url = 'https://admin:password@nowhere.com'
      const sut = scrubs.scrub(url)
      expect(sut).to.equal('https://admin:<secured>@nowhere.com')
    })

    it('should secure url query parameters', () => {
      const url = 'https://nowhere.com?password=secret'
      const sut = scrubs.scrub(url)
      expect(sut).to.equal('https://nowhere.com?password=<secured>')
    })
  })

  describe('that has protected properties', () => {
    it('should replace property with secured option', () => {
      const expected_url = 'https://nobody:<secured>@nowhere.com/?apikey=<secured>&password=<secured>'
      const sut = scrubs.scrub(root)
      expect(sut.user.email).to.equal(root.user.email)
      expect(sut.user.password).to.equal('<secured>')
      expect(sut.strings).to.deep.equal([expected_url])
    })
  })
})
