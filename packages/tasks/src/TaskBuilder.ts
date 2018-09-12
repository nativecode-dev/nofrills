import { Is } from '@nofrills/types'
import { fs, CreateResolver, FileResolver } from '@nofrills/fs'

import { Task } from './Task'
import { TaskConfig } from './TaskConfig'
import { TaskDefinition } from './TaskDefinitions'

import { Lincoln, Logger, ConsoleLog } from './Logging'
import { TaskRunner, TaskJobResult } from './TaskRunner'
import { TaskConfigError } from './errors/TaskConfigError'

export interface TaskContext {
  config: TaskConfig
  name: string
  tasks: TaskDefinition[]
}

export class TaskBuilder {
  private readonly log: Lincoln = Logger.extend('builder')
  private readonly resolver: FileResolver

  constructor(public readonly cwd: string, private readonly definitions: string[]) {
    this.resolver = CreateResolver(cwd)
  }

  static from(cwd: string, definitions: string[] = ['tasks.json', 'package.json']): TaskBuilder {
    return new TaskBuilder(cwd, definitions)
  }

  async build(): Promise<TaskConfig> {
    const configs = await this.resolve()

    if (configs.length > 0) {
      const filename = configs[0]
      const config = await fs.json<TaskConfig>(filename)
      this.log.debug('found', filename, config.tasks)
      return this.transform(config)
    }

    throw new TaskConfigError(`failed to find configuration: ${this.definitions} in ${this.cwd}`)
  }

  async run(names: string[]): Promise<TaskJobResult[]> {
    const config = await this.build()
    const runner = new TaskRunner(config)
    this.log.debug('run', names)
    return runner.run(names, this.cwd)
  }

  protected convert(command: string, config: TaskConfig): Task[] {
    const regex = /\[(.*)\]/g
    const matches = regex.exec(command)

    if (matches) {
      const key = matches[1]
      const context: TaskContext = {
        config,
        name: key,
        tasks: config.tasks[key],
      }

      this.log.debug('convert', key, context.tasks)

      return this.expand(context).tasks as Task[]
    }

    const parts = command.split(' ')
    const result = { arguments: parts.slice(1), command: parts[0], name: parts[0] }

    return [result]
  }

  protected expand(context: TaskContext): TaskContext {
    this.log.debug('expand', context.tasks)

    context.tasks = context.tasks
      .map(task => {
        if (Is.string(task)) {
          return this.convert(String(task), context.config)
        }
        return [task]
      })
      .reduce((previous, current) => previous.concat(current))

    return context
  }

  protected async resolve(): Promise<string[]> {
    const resolved = await Promise.all(this.definitions.map(definition => this.resolver.find(definition)))
    this.log.debug('resolve', ...resolved)
    return resolved.reduce((results, current) => results.concat(...current), [])
  }

  protected transform(config: TaskConfig): TaskConfig {
    return Object.keys(config.tasks)
      .map(key => ({ config, name: key, tasks: config.tasks[key] }))
      .filter(context => {
        if (context.tasks) {
          return true
        }
        ConsoleLog.error(`failed to find task: ${context.name}`)
        return false
      })
      .map(context => this.expand(context))
      .reduce((result, context) => {
        this.log.debug('transform', result.tasks[context.name], context.tasks)
        result.tasks[context.name] = context.tasks
        return result
      }, config)
  }
}
