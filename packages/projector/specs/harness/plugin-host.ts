import { PluginHost } from '../../src'

export class TestPluginHost implements PluginHost {
  readonly name: string = 'test-host'
}
