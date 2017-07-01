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

describe('when scrubbing an object', () => {
  describe('that has protected properties', () => {
    it('should replace property with secured option', () => {
      const sut = scrubs.scrub([root.user])[0]
      expect(sut.email).to.equal(root.user.email)
      expect(sut.password).to.equal('<secured>')
    })

    it('should echo string', () => {
      const sut = scrubs.scrub('test')
      expect(sut).to.equal('test')
    })
  })

  describe('that has protected values', () => {})
})
