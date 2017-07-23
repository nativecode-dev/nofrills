import { expect } from 'chai'
import { Strings } from '../src/Index'

describe('when using string extensions', () => {
  describe('format', () => {
    it('should format string', () => {
      const expected = 'smorgasbord'
      const message = '{0}'
      const args = ['smorgasbord']
      expect(Strings.format(message, ...args)).to.equal(expected)
    })

    it('should allow using token multiple times', () => {
      const expected = 'The quick brown fox jumped over the test, because test.'
      const message = 'The {0} brown fox jumped over the {1}, because {1}.'
      const args = ['quick', 'test']
      expect(Strings.format(message, ...args)).to.equal(expected)
    })
  })
})
