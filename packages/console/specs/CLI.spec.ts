import expect from './expect'
import { CLI, ConsoleOptions } from '../src'

describe('when creating CLI consoles', () => {

  const options: ConsoleOptions = {}

  it('should create instance', () => {
    const sut = CLI.create(options, 'executable.exe')
    expect(sut).to.not.be.undefined
  })

})
