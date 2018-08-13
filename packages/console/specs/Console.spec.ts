import expect from './expect'
import { Console, ConsoleOptions } from '../src'

describe('when creating consoles', () => {

  const options: ConsoleOptions = {}

  it('should create instance', () => {
    const sut = Console.create(options, 'executable.exe')
    expect(sut).to.not.be.undefined
  })

})
