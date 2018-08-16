import { PluginContext } from './PluginContext'

export interface Plugin {
  readonly name: string
  execute(context: PluginContext): Promise<PluginContext>
}

export interface PluginHost {
  readonly name: string
}

export type PluginConstructor<T = Plugin> = new (host: PluginHost) => T
