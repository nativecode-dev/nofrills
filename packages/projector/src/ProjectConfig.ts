import { fs } from '@nofrills/fs'
import { Registry } from '@nofrills/collections'

import Logger from './Logger'

import { Project } from './Project'
import { PluginHost } from './PluginHost'
import { ProjectSupport } from './ProjectSupport'

export type ProjectConfigHandler = (
  host: PluginHost,
  project: Project,
  filepath: string,
) => Promise<ProjectConfig | null>

export const ConfigHandlerRegistry: Registry<ProjectConfigHandler> = new Registry<ProjectConfigHandler>()

export class ProjectConfig {
  protected readonly log = Logger.extend('config').extend(fs.basename(this.path))

  constructor(
    private readonly parent: Project,
    private readonly filepath: string,
    private readonly config: any,
    private readonly caps: ProjectSupport[] = [],
  ) {
    this.log.debug('filepath', fs.relativeFrom(filepath))
    this.log.debug('caps', ...caps)
  }

  get name(): string {
    return this.config['name'] ? this.config['name'] : undefined
  }

  get path(): string {
    return this.filepath
  }

  get project(): Project {
    return this.parent
  }

  static caps(config: any): ProjectSupport[] {
    const caps: ProjectSupport[] = []

    for (const key in ProjectSupport) {
      const value = ProjectSupport[key]
      if (config[value]) {
        caps.push(ProjectSupport[key] as ProjectSupport)
      }
    }

    return caps
  }

  as<T>(): T {
    return this.config
  }

  async save(): Promise<boolean> {
    if (await fs.save(this.filepath, this.config)) {
      this.log.debug(`${this.name}:save`, this.filepath)
      return true
    }
    return false
  }

  supports(support: ProjectSupport): boolean {
    return this.caps.indexOf(support) > -1
  }
}
