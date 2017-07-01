const expect = require('chai').expect
const scrubs = require('../lib/scrubs')

const root = {
  apikey: '<SECRET>',
  url: 'https://nobody:s4p3rs3cr3t@nowhere.com/?apikey=SECRET&password=s4p3rs3cr3t',
  user: {
    email: 'nobody@nowhere.com',
    password: 's4p3rs3cr3t',
  }
}

describe('when using scrubs', () => {
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
  })

  describe('that has protected properties', () => {
    it('should replace property with secured option', () => {
      const sut = scrubs.scrub(root.user)
      expect(sut.email).to.equal(root.user.email)
      expect(sut.password).to.equal('<secured>')
    })
  })

  describe('that has protected values', () => {})
})
