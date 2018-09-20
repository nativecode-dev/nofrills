import expect from './expect'
import { CLI, ConsoleOptions, ProcessArgs } from '../src'

describe('when creating CLI consoles', () => {
  const options: ConsoleOptions = {}
  const args: string[] = ['executable.exe']

  it('should create instance', () => expect(CLI.run(options, ProcessArgs.from(args))).to.not.be.undefined)
})
