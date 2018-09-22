import 'mocha'

import expect from './expect'

import { Command } from '../src/Command'
import { CommandGroup } from '../src/CommandGroup'

describe('when using CommandGroup', () => {
  // tslint:disable-next-line:variable-name
  const sleep_short = Command.from({ exe: 'sleep', args: ['1'] })
  // tslint:disable-next-line:variable-name
  const sleep_medium = Command.from({ exe: 'sleep', args: ['2'] })
  // tslint:disable-next-line:variable-name
  const sleep_long = Command.from({ exe: 'sleep', args: ['3'] })

  describe('with exec', () => {
    it('should execute in parallel', async () => {
      const sut = CommandGroup.from(sleep_long, sleep_medium, sleep_short)
      const results = await sut.parallel()
      expect(results.map(result => result.args[0])).to.deep.equal(['3', '2', '1'])
    }).timeout(5000)

    it('should execute serially', async () => {
      const sut = CommandGroup.from(sleep_long, sleep_medium, sleep_short)
      const results = await sut.serial()
      expect(results.map(result => result.args[0])).to.include.ordered.members(['3', '2', '1'])
    }).timeout(10000)
  })
})
