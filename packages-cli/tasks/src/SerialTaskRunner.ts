import * as execa from 'execa'

import { serial } from '@nofrills/patterns'

import { ConsoleLog, Lincoln, Logger } from './Logging'

import { TaskJob } from './TaskJob'
import { TaskEntry } from './TaskEntry'
import { TaskEntryType } from './TaskEntryType'
import { TaskRunnerAdapter } from './TaskRunnerAdapter'
import { TaskJobResult, EmptyTaskJobResult } from './TaskJobResult'

export type TaskJobExec = () => Promise<TaskJobResult>

export interface TaskContext {
  entry: TaskEntry
  env: NodeJS.ProcessEnv
  job: TaskJob
}

export class SerialTaskRunner implements TaskRunnerAdapter {
  readonly stdin: NodeJS.ReadStream = process.stdin
  readonly stdout: NodeJS.WriteStream = process.stdout
  readonly stderr: NodeJS.WriteStream = process.stderr

  private readonly log: Lincoln = Logger.extend('serial')

  execute(job: TaskJob): Promise<TaskJobResult[]> {
    ConsoleLog.info('[task]', job.name)

    const createTask = (entry: TaskEntry) => this.run({ entry, env: job.env, job })
    const initiator = () => Promise.resolve([])

    return serial(job.task.entries.map(createTask), initiator)
  }

  protected run(context: TaskContext): TaskJobExec {
    const entry = context.entry

    this.log.debug('execute', context.job.cwd, entry)

    switch (entry.type) {
      case TaskEntryType.skip:
        return async () => EmptyTaskJobResult(entry)

      case TaskEntryType.env:
        return async () => {
          context.env[entry.command] = entry.arguments ? entry.arguments[0] : undefined
          return EmptyTaskJobResult(entry)
        }

      default:
        return () => {
          const args = entry.arguments ? entry.arguments.join(' ') : entry.arguments
          ConsoleLog.info(`<${entry.type}${entry.command}>`, args)
          return this.exec(context)
        }
    }
  }

  protected async exec(context: TaskContext): Promise<TaskJobResult> {
    const entry = context.entry

    const command = execa(entry.command, entry.arguments, {
      cwd: context.job.cwd,
      env: context.env,
      stdio: ['inherit', 'pipe', 'pipe']
    })

    command.stderr.pipe(process.stderr)
    command.stdout.pipe(process.stdout)

    const { code, signal, stderr, stdout } = await command

    const result: TaskJobResult = {
      code,
      entry,
      errors: this.convertString(stderr),
      messages: this.convertString(stdout),
      signal,
    }

    this.log.debug(entry.command, result)

    return result
  }

  private convertString(value: string): string[] {
    return value && value !== '' ? [value] : []
  }
}
