import { ChainAsync } from '@nofrills/patterns'

import { Plugin } from './Plugin'
import { Project } from './Project'
import { PluginContext } from './PluginContext'

export class Pipeline {
  public static readonly instance: Pipeline = new Pipeline()

  protected constructor() {}

  async execute(project: Project, stages: string[], plugins: Plugin[]): Promise<void> {
    const promises = stages
      .map(stage => stage.toLowerCase())
      .map<PluginContext>(stage => ({ data: {}, project, stage }))
      .map(context => this.delegate(context, plugins))

    await Promise.all(promises)
  }

  private delegate(context: PluginContext, plugins: Plugin[]): Promise<PluginContext> {
    const delegates = plugins.map(plugin => plugin.execute)
    const chains = ChainAsync.from<PluginContext, PluginContext>(delegates)

    return chains.execute(context, () => Promise.resolve(context))
  }
}
