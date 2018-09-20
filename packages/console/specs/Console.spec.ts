import expect from './expect'
import { Console, ConsoleOptions, ProcessArgs } from '../src'

describe('when creating consoles', () => {
  const options: ConsoleOptions = {}
  const args: string[] = ['executable.exe']

  it('should create instance', () => expect(Console.run(options, ProcessArgs.from(args))).to.not.be.undefined)
})
