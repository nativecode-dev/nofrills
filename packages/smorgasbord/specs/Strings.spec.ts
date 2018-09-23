import 'mocha'

import { expect } from 'chai'
import { Strings } from '../src/Strings'

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

    it('should format based on object keys', () => {
      const expected = 'The quick brown fox jumped over the test, because test.'
      const message = 'The {q} brown fox jumped over the {t}, because {t}.'
      const args = { q: 'quick', t: 'test' }
      expect(Strings.formatObject(message, args)).to.equal(expected)
    })
  })
})
