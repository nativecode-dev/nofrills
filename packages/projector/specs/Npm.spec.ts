import 'mocha'

import { fs } from '@nofrills/fs'

import expect from './expect'
import { NpmConfig, NpmFile, Project } from '../src'

import { TestPluginHost } from './harness/plugin-host'

describe('when using the NpmConfig handler', () => {
  let project: Project

  const host = new TestPluginHost()
  const cwd = fs.join(process.cwd(), 'packages', 'projector', 'specs', 'data')
  const single = fs.join(cwd, 'single', NpmFile)
  const invalidConfig = fs.join(cwd, 'single', 'invalid-config.json')
  const invalidConfigLocation = fs.join(cwd, 'non-existant', NpmFile)

  before(async () => {
    project = await Project.load(host, single)
  })

  it('should return null when configuration filename is invalid', () => {
    expect(NpmConfig(host, project, invalidConfig)).to.eventually.be.null
  })

  it('should return null when configuration does not exist', () => {
    expect(NpmConfig(host, project, invalidConfigLocation)).to.eventually.be.null
  })
})
