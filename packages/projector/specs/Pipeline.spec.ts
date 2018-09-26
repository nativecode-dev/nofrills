import 'mocha'

import { fs } from '@nofrills/fs'

import expect from './expect'

import { Plugin } from '../src/Plugin'
import { Project } from '../src/Project'
import { Pipeline } from '../src/Pipeline'
import { PluginContext } from '../src/PluginContext'
import { TestPluginHost } from './harness/plugin-host'

describe('when using pipelines', () => {
  const projector = fs.resolve(__dirname, '../')
  const data = fs.join(projector, 'specs', 'data')
  const single = fs.join(data, 'single')
  const host = new TestPluginHost()

  class TestPlugin implements Plugin {
    readonly name: string = 'test'

    execute(context: PluginContext): Promise<PluginContext> {
      context.data['test'] = true
      return Promise.resolve(context)
    }
  }

  const plugin = new TestPlugin()

  it('should execute stage with plugins', async () => {
    const project = await Project.load(host, single)
    const pipeline = Pipeline.instance.execute(project, ['build'], [plugin])
    expect(pipeline).to.not.be.undefined
  })
})
