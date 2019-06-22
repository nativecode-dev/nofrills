import 'mocha'

import { fs } from '@nofrills/fs'

import expect from './expect'
import { NotFound, Npm, NpmFile, Project } from '../src'

import { TestPluginHost } from './harness/plugin-host'

describe('when using Project', () => {
  const cwd = fs.join(process.cwd(), 'packages', 'projector', 'specs', 'data')
  const single = fs.join(cwd, 'single', NpmFile)
  const workspaces = fs.join(cwd, 'workspaces', NpmFile)

  const host = new TestPluginHost()

  it('should fail to load non-existant project file', () => {
    const invalidProjectFile = fs.join(cwd, 'workspaces-no-exist', NpmFile)
    expect(Project.load(host, invalidProjectFile)).to.eventually.be.rejected
  })

  describe('to load an existing package.json file', () => {
    it('should fail to load non-existant configuration', async () => {
      const sut = await Project.load(host, single)
      expect(() => sut.as('config-not-exist.json')).to.throw()
    })

    it('should load a stand-alone project', async () => {
      const sut = await Project.load(host, single)
      const config = sut.as<Npm>(NpmFile)
      expect(config.name).to.equal('project-single')
    })

    it('should load workspaces defined in a project', async () => {
      const sut = await Project.load(host, workspaces)
      expect(sut.projects()).to.be.length(2)
    })
  })

  describe('working with workspaces', () => {
    let project: Project

    before(async () => {
      project = await Project.load(host, workspaces)
    })

    it('should get child configuration', () => {
      const children = project.projects()
      expect(children).to.be.length(2)
    })
  })
})
