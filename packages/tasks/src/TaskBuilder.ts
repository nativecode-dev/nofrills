import { Is } from '@nofrills/types'
import { fs, CreateResolver, FileResolver } from '@nofrills/fs'

import { Task } from './Task'
import { TaskConfig } from './TaskConfig'
import { TaskDefinition } from './TaskDefinitions'

import { Lincoln, Logger, ConsoleLog } from './Logging'
import { TaskRunner, TaskJobResult } from './TaskRunner'
import { TaskConfigError } from './errors/TaskConfigError'
import { TaskEntry } from './TaskEntry'

export interface TaskContext {
  config: TaskConfig
  name: string
  task: Task
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
      ConsoleLog.debug('task-config', filename)
      const transformed = this.transform(config)
      ConsoleLog.debug('task-config', JSON.stringify(transformed, null, 2))
      return transformed
    }

    throw new TaskConfigError(`failed to find configuration: ${this.definitions} in ${this.cwd}`)
  }

  async run(names: string[], config?: TaskConfig): Promise<TaskJobResult[]> {
    config = config || (await this.build())
    const runner = new TaskRunner(config)
    this.log.debug('run', names, config)
    return runner.run(names, this.cwd)
  }

  protected expand(config: TaskConfig, value: Task | TaskDefinition[]): Task {
    this.log.debug('expand', value)

    if (Is.array(value)) {
      return { entries: this.fromArray(config, value as TaskDefinition[]) }
    } else if (Is.object(value)) {
      const task = value as Task
      return Object.assign({}, task, this.expand(config, task.entries))
    }
    return value as Task
  }

  protected fromArray(config: TaskConfig, definitions: TaskDefinition[]): TaskEntry[] {
    const entries = definitions
      .map(task => {
        if (Is.string(task)) {
          return this.fromString(config, String(task))
        }
        return [task as TaskEntry]
      })
      .reduce((previous, current) => previous.concat(current))

    return entries
  }

  protected fromString(config: TaskConfig, command: string): TaskEntry[] {
    const regex = /\[(.*)\]/g
    const matches = regex.exec(command)

    if (matches) {
      const name = matches[1]
      const context: TaskContext = {
        config,
        name,
        task: this.expand(config, config.tasks[name]),
      }

      this.log.debug('task->entry', name, context.task)
      return this.fromArray(context.config, context.task.entries)
    }

    const parts = command.split(' ')
    const entry = { arguments: parts.slice(1), command: parts[0], name: parts[0] }
    return [entry]
  }

  protected async resolve(): Promise<string[]> {
    const resolved = await Promise.all(this.definitions.map(definition => this.resolver.find(definition)))
    this.log.debug('resolve', ...resolved)
    return resolved.reduce((results, current) => results.concat(...current), [])
  }

  protected transform(config: TaskConfig): TaskConfig {
    return Object.keys(config.tasks)
      .map(key => ({ config, name: key, task: config.tasks[key] }))
      .filter(context => {
        if (context.task) {
          return true
        }
        ConsoleLog.error(`failed to find task: ${context.name}`)
        return false
      })
      .map(context => {
        context.task = this.expand(context.config, context.task)
        return context
      })
      .reduce((result, context) => {
        this.log.debug('transform', result.tasks[context.name], context.task)
        result.tasks[context.name] = context.task
        return result
      }, config)
  }
}
