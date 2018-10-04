import * as execa from 'execa'

import { ConsoleLog, Lincoln, Logger } from './Logging'

import { TaskJob } from './TaskJob'
import { TaskEntry } from './TaskEntry'
import { TaskEntryType } from './TaskEntryType'
import { TaskRunnerAdapter } from './TaskRunnerAdapter'
import { TaskJobResult, EmptyTaskJobResult } from './TaskJobResult'

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

    return job.task.entries.reduce(async (results, entry) => {
      const context: TaskContext = {
        entry,
        env: job.env,
        job,
      }

      const result = await this.run(context)
      const previous = await results

      return previous.concat(result)
    }, Promise.resolve<TaskJobResult[]>([]))
  }

  protected run(context: TaskContext): Promise<TaskJobResult> {
    const entry = context.entry

    ConsoleLog.info(`<${entry.type}${entry.command}>`, entry.arguments ? entry.arguments.join(' ') : entry.arguments)

    this.log.debug('execute', context.job.cwd, entry)

    switch (entry.type) {
      case TaskEntryType.bail:
        return Promise.resolve(EmptyTaskJobResult(entry))

      case TaskEntryType.env:
        const result = EmptyTaskJobResult(entry)
        context.env[entry.command] = entry.arguments ? entry.arguments[0] : undefined
        return Promise.resolve(result)

      case TaskEntryType.skip:
        return Promise.resolve(EmptyTaskJobResult(entry))

      default:
        return this.spawnContext(context)
    }
  }

  protected async spawnContext(context: TaskContext): Promise<TaskJobResult> {
    const entry = context.entry

    const proc = execa(entry.command, entry.arguments, {
      shell: context.job.task.shell,
    })

    proc.stdin.pipe(this.stdin)
    proc.stdout.pipe(this.stdout)
    proc.stderr.pipe(this.stderr)

    const { code, stdout } = await proc

    return {
      code,
      entry,
      errors: [],
      messages: [stdout],
      signal: null,
    }
  }
}
