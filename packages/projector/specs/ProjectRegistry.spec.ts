import 'mocha'

import expect from './expect'
import { Plugin, PluginHost, ProjectRegistry, PluginContext, PluginConstructor } from '../src'
import { TestPluginHost } from './harness/plugin-host'

class TestPlugin implements Plugin {
  readonly name: string = 'test'

  execute(context: PluginContext): Promise<PluginContext> {
    return Promise.resolve(context)
  }
}

interface ProjectRegistryTest {
  host: PluginHost
  registry: ProjectRegistry
}

describe('when using the project registry', () => {

  const context: ProjectRegistryTest = {
    host: new TestPluginHost(),
    registry: ProjectRegistry.create(),
  }

  beforeEach(() => {
    context.registry = ProjectRegistry.create()
  })

  it('should create plugin from registry', () => {
    const SUT = context.registry.plugin('test', TestPlugin) as PluginConstructor<Plugin>
    const plugin = new SUT(context.host)
    expect(plugin.name).equals('test')
  })

})
