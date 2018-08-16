import { Registry as RegistryMap } from '@nofrills/collections'

import { Plugin, PluginConstructor } from './Plugin'

export class ProjectRegistry {
  private static readonly registry: ProjectRegistry = new ProjectRegistry()

  private readonly pluginRegistry: RegistryMap<PluginConstructor<Plugin>> = new RegistryMap<PluginConstructor<Plugin>>()

  private constructor() { }

  static create(): ProjectRegistry {
    return new ProjectRegistry()
  }

  static get instance(): ProjectRegistry {
    return ProjectRegistry.registry
  }

  get plugins(): Iterable<PluginConstructor<Plugin>> {
    return this.pluginRegistry.values
  }

  plugin<T extends Plugin>(key: string, plugin?: PluginConstructor<T>): PluginConstructor<Plugin> | undefined {
    if (plugin) {
      this.pluginRegistry.register(key, plugin)
    }
    return this.pluginRegistry.resolve(key)
  }
}

export const Registry: ProjectRegistry = ProjectRegistry.instance
