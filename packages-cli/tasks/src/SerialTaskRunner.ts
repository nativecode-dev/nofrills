import * as execa from 'execa'

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

function sequence(tasks: TaskJobExec[]) {
  return Promise.all([]).then((args: any[]) => {
    let current = Promise.resolve.call(Promise)
    const result: TaskJobResult[] = []

    tasks.forEach((task: TaskJobExec) => {
      if (task && task.apply) {
        result.push(
          (current = current.then(() => {
            return task()
          })),
        )
      }
    })
    return Promise.all(result)
  })
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

    ConsoleLog.info(`<${entry.type}${entry.command}>`, entry.arguments ? entry.arguments.join(' ') : entry.arguments)

    this.log.debug('execute', context.job.cwd, entry)

    switch (entry.type) {
      case TaskEntryType.bail:
      case TaskEntryType.skip:
        return () => Promise.resolve(EmptyTaskJobResult(entry))

      case TaskEntryType.env:
        context.env[entry.command] = entry.arguments ? entry.arguments[0] : undefined
        return () => Promise.resolve(EmptyTaskJobResult(entry))

      default:
        return () => this.exec(context)
    }
  }

  protected async exec(context: TaskContext): Promise<TaskJobResult> {
    const entry = context.entry

    const command = execa(entry.command, entry.arguments, {
      shell: context.job.task.shell,
    })

    command.stdin.pipe(this.stdin)
    command.stdout.pipe(this.stdout)
    command.stderr.pipe(this.stderr)

    const { code, stdout } = await command

    return {
      code,
      entry,
      errors: [],
      messages: [stdout],
      signal: null,
    }
  }
}
