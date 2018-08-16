import { PluginHost } from './PluginHost'
import { PluginContext } from './PluginContext'

export interface Plugin {
  readonly name: string
  execute(context: PluginContext): Promise<PluginContext>
}

export interface PluginConstructor<T = Plugin> {
  new (host: PluginHost): T
}
