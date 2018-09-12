import 'mocha'

import { fs } from '@nofrills/fs'

import expect from './expect'
import { SshParser } from '../src/SshParser'
import { GrammarError } from '../src/errors/GrammarError'

describe('when using SshParser', () => {
  const cwd = fs.resolve(__dirname, '..')
  const assets = fs.join(cwd, 'specs/assets')

  it('should create parser', async () => {
    const ssh = SshParser.from(cwd, 'src/config.pegjs')
    const sut = await ssh.generate()
    expect(sut).to.not.be.undefined
  })

  it('should throw when invalid grammar', async () => {
    const sut = SshParser.from(cwd, 'invalid.pegjs')
    expect(sut.generate()).to.be.rejectedWith(GrammarError)
  })

  describe('to parse ssh config files', () => {
    const invalid = fs.join(assets, 'ssh-config-invalid')
    const valid = fs.join(assets, 'ssh-config')
    const ssh = SshParser.from(cwd, 'src/config.pegjs')

    it('should parse config', async () => {
      const config = await fs.readFile(valid)
      const sut = await ssh.generate()
      const result = sut.parse(config.toString())
      expect(result).to.not.be.undefined
    })

    it('should fail to parse config', async () => {
      const config = await fs.readFile(invalid)
      const sut = await ssh.generate()
      expect(() => sut.parse(config.toString())).to.throw
    })
  })
})
