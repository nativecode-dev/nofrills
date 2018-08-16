import { EventEmitter } from 'events'
import { FileSystem as fs } from '@nofrills/fs'

import { NotFound } from './Errors'
import { PluginHost } from './Plugin'
import { Pipeline } from './Pipeline'
import { Lincoln, Logger } from './Logger'
import { Registry } from './ProjectRegistry'
import { ProjectFiles } from './ProjectFiles'
import { ConfigHandlerRegistry, ProjectConfig } from './ProjectConfig'

const logger = Logger.extend('project')

export enum ProjectEvents {
  Config = 'CONFIG',
  Create = 'CREATE',
  Files = 'FILES',
}

export class Project extends EventEmitter {
  private readonly children: Project[] = []
  private readonly configmap: { [key: string]: ProjectConfig } = {}
  private readonly referenceMap: Map<string, ProjectFiles> = new Map<string, ProjectFiles>()

  protected readonly log: Lincoln

  private constructor(private readonly root: string, private readonly host: PluginHost) {
    super()
    this.log = logger.extend(this.name)
    this.emit(ProjectEvents.Create, this)
  }

  get name(): string {
    return fs.basename(this.path)
  }

  get path(): string {
    return this.root
  }

  get references(): Iterable<string> {
    return this.referenceMap.keys()
  }

  execute(stages: string[]): Promise<void> {
    return Pipeline.instance.execute(this, stages, Array.from(Registry.plugins).map(plugin => new plugin(this.host)))
  }

  projects(): Project[] {
    return this.children.slice().sort((a, b) => a.name >= b.name ? 1 : 0)
  }

  reference(key: string, files?: ProjectFiles): ProjectFiles {
    if (this.referenceMap.has(key) === false && files) {
      this.referenceMap.set(key, files)
      this.emit(ProjectEvents.Files, files)
    }

    const reference = this.referenceMap.get(key)

    if (reference) {
      return reference
    }

    throw new NotFound(key)
  }

  static async load(host: PluginHost, filepath: string): Promise<Project> {
    if (await fs.exists(filepath) === false) {
      throw new NotFound(filepath)
    }

    logger.debug('load-attempt', fs.relativeFrom(filepath))

    const root = fs.dirname(filepath)
    const filename = fs.basename(filepath)

    const project = new Project(root, host)
    project.log.debug('load-project', fs.relativeFrom(filepath))

    const handler = ConfigHandlerRegistry.resolve(filename)
    project.log.debug('load-handler', filename, !!handler)

    if (handler) {
      const config = await handler(host, project, filepath)
      project.log.debug('load-config', !!config)

      if (config) {
        project.set(config)
      }
    }

    project.log.debug('load-done', project.name)

    return project
  }

  add(project: Project): number {
    this.log.debug('add-project', this.children.length, project.name)
    return this.children.push(project)
  }

  as<T>(filename: string): T {
    return this.config(filename).as<T>()
  }

  config(filename: string): ProjectConfig {
    const key = this.configKey(filename)
    this.log.debug('get-config', key)
    if (this.configmap[key]) {
      return this.configmap[key]
    }
    throw new NotFound(filename)
  }

  protected set(config: ProjectConfig): Project {
    const key = this.configKey(config.path)
    this.configmap[key] = config
    this.emit(ProjectEvents.Config, config)
    this.log.debug('set-config', key, fs.relativeFrom(config.path))
    return this
  }

  protected configKey(filename: string): string {
    return `${this.name}::${fs.basename(filename)}`
  }
}
