import { fs } from '@nofrills/fs'
import { Registry } from '@nofrills/collections'

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
  constructor(
    private readonly parent: Project,
    private readonly filepath: string,
    private readonly config: any,
    private readonly caps: string[] = [],
  ) {}

  get name(): string {
    return this.config['name'] ? this.config['name'] : undefined
  }

  get path(): string {
    return this.filepath
  }

  get project(): Project {
    return this.parent
  }

  static caps(config: any): string[] {
    const caps: string[] = []

    for (const key in ProjectSupport) {
      const value = ProjectSupport[key]
      if (config[value]) {
        caps.push(ProjectSupport[key])
      }
    }

    return caps
  }

  as<T>(): T {
    return this.config
  }

  async save(): Promise<boolean> {
    if (await fs.save(this.filepath, this.config)) {
      return true
    }
    return false
  }

  supports(support: string): boolean {
    return this.caps.indexOf(support) > -1
  }
}
