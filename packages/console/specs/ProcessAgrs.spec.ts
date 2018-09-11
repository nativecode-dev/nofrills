import 'mocha'

import expect from './expect'
import { ProcessArgs } from '../src'

describe('when using ProcessArgs', () => {
  const exe = '/usr/local/bin/executable'
  const node = '/bin/node'

  describe('args', () => {
    const argsNode = [node, exe]
    const argsNoNode = [exe]

    it('should parse arguments when called from node', () => {
      const sut = ProcessArgs.from(argsNode)
      expect(sut.args).to.have.ordered.members([exe])
    })

    it('should parse arguments when not called from node', () => {
      const sut = ProcessArgs.from(argsNoNode, false)
      expect(sut.args).to.have.ordered.members([exe])
    })
  })

  describe('exe', () => {
    const argsNode = [node, exe]
    const argsNoNode = [exe]

    it('should parse arguments when called from node', () => {
      const sut = ProcessArgs.from(argsNode)
      expect(sut.exe).to.be.equal(exe)
    })

    it('should parse arguments when not called from node', () => {
      const sut = ProcessArgs.from(argsNoNode, false)
      expect(sut.exe).to.be.equal(exe)
    })
  })

  describe('normalized', () => {
    const args = ['--config', 'filename']
    const argsNode = [node, exe, ...args]
    const argsNoNode = [exe, ...args]

    it('should parse and exclude exe arguments when called from node', () => {
      const sut = ProcessArgs.from(argsNode)
      expect(sut.normalized).to.have.ordered.members([...args])
    })

    it('should parse and exclude exe arguments when not called from node', () => {
      const sut = ProcessArgs.from(argsNoNode, false)
      expect(sut.normalized).to.have.ordered.members([...args])
    })
  })
})
