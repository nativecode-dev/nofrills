import * as execa from 'execa'
import * as getstream from 'get-stream'

import { Returns } from '@nofrills/patterns'

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

function sequence(tasks: TaskJobExec[]): Promise<TaskJobResult[]> {
  return tasks.reduce<Promise<TaskJobResult[]>>(
    (previous, task) =>
      previous.then(results => task().then(value => Returns(results).after(() => results.push(value)))),
    Promise.resolve([]),
  )
}

export class SerialTaskRunner implements TaskRunnerAdapter {
  readonly stdin: NodeJS.ReadStream = process.stdin
  readonly stdout: NodeJS.WriteStream = process.stdout
  readonly stderr: NodeJS.WriteStream = process.stderr

  private readonly log: Lincoln = Logger.extend('serial')

  execute(job: TaskJob): Promise<TaskJobResult[]> {
    ConsoleLog.info('[task]', job.name)

    return sequence(
      job.task.entries.map(entry => {
        const context: TaskContext = {
          entry,
          env: job.env,
          job,
        }

        return this.run(context)
      }),
    )
  }

  protected run(context: TaskContext): TaskJobExec {
    const entry = context.entry

    this.log.debug('execute', context.job.cwd, entry)

    switch (entry.type) {
      case TaskEntryType.skip:
        return () => Promise.resolve(EmptyTaskJobResult(entry))

      case TaskEntryType.env:
        context.env[entry.command] = entry.arguments ? entry.arguments[0] : undefined
        return () => Promise.resolve(EmptyTaskJobResult(entry))

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
      env: context.env,
      extendEnv: true,
      localDir: context.job.cwd,
      shell: context.job.task.shell,
    })

    command.stdout.pipe(process.stdout)

    const stdout = await getstream(command.stdout)

    const { code } = await command

    const result: TaskJobResult = {
      code,
      entry,
      errors: [],
      messages: [stdout],
      signal: null,
    }

    this.log.debug(entry.command, result)

    return result
  }
}
