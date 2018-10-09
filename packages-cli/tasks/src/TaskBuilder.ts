import { Is } from '@nofrills/types'
import { Returns } from '@nofrills/patterns'
import { fs, CreateResolver, FileResolver } from '@nofrills/fs'

import { Task } from './Task'
import { TaskConfig } from './TaskConfig'
import { TaskDefinition } from './TaskDefinitions'

import { Lincoln, Logger, ConsoleLog } from './Logging'
import { TaskRunner } from './TaskRunner'
import { TaskJobResult } from './TaskJobResult'
import { TaskConfigError } from './errors/TaskConfigError'
import { TaskEntry } from './TaskEntry'
import { TaskEntryType } from './TaskEntryType'
import { SerialTaskRunner } from './SerialTaskRunner'

export interface TaskContext {
  config: TaskConfig
  name: string
  task: Task
}

export class TaskBuilder {
  private readonly log: Lincoln = Logger.extend('builder')
  private readonly resolver: FileResolver

  constructor(
    public readonly cwd: string,
    private readonly definitions: string[],
    private readonly config?: TaskConfig,
  ) {
    this.resolver = CreateResolver(cwd)
  }

  static file(cwd: string, definitions: string[] = ['tasks.json', 'package.json']): TaskBuilder {
    return new TaskBuilder(cwd, definitions)
  }

  static from(config: TaskConfig): TaskBuilder {
    return new TaskBuilder(process.cwd(), [], config)
  }

  async build(): Promise<TaskConfig> {
    if (this.config) {
      const transformed = this.transform(this.config)
      this.log.debug('task-config', JSON.stringify(transformed.tasks, null, 2))
      return transformed
    }

    const configs = await this.resolve()

    if (configs.length > 0) {
      const filename = configs[0]
      const config = await fs.json<TaskConfig>(filename)
      ConsoleLog.trace('task-config', filename)
      const transformed = this.transform(config)
      this.log.debug('task-config', JSON.stringify(transformed.tasks, null, 2))
      return transformed
    }

    throw new TaskConfigError(`failed to find configuration: ${this.definitions} in ${this.cwd}`)
  }

  async run(names: string[], config?: TaskConfig): Promise<TaskJobResult[]> {
    config = config || (await this.build())
    const runner = new TaskRunner(config, new SerialTaskRunner())
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
    return definitions
      .map(task => {
        if (Is.string(task)) {
          return this.fromString(config, String(task))
        }
        return [task as TaskEntry]
      })
      .reduce<TaskEntry[]>((previous, current) => previous.concat(current), [])
  }

  protected fromString(config: TaskConfig, command: string): TaskEntry[] {
    const regex = /^\[(.*)\]/g
    const matches = regex.exec(command)

    if (matches) {
      const name = matches[1]
      const context: TaskContext = {
        config,
        name,
        task: this.expand(config, config.tasks[name]),
      }

      return this.fromArray(context.config, context.task.entries).map(entry =>
        Returns(entry).after(() => (entry.origin = name)),
      )
    }

    return [this.createEntry(command)]
  }

  protected createEntry(command: string): TaskEntry {
    const parts = command.split(' ')
    const type = this.type(parts[0])

    return {
      arguments: parts.slice(1),
      command: type === TaskEntryType.spawn ? parts[0] : parts[0].substring(1),
      name: parts[0],
      type,
    }
  }

  protected type(command: string): TaskEntryType {
    const prefix = command[0]

    switch (prefix) {
      case TaskEntryType.bail:
        return TaskEntryType.bail

      case TaskEntryType.capture:
        return TaskEntryType.capture

      case TaskEntryType.env:
        return TaskEntryType.env

      case TaskEntryType.exec:
        return TaskEntryType.exec

      case TaskEntryType.skip:
        return TaskEntryType.skip

      default:
        return TaskEntryType.spawn
    }
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
