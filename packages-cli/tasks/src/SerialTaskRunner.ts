import { ExecOptions, SpawnOptions, exec, spawn } from 'child_process'

import { ErrorCode } from './errors'
import { TaskJob } from './TaskJob'
import { TaskEntry } from './TaskEntry'
import { TaskEntryType } from './TaskEntryType'
import { ConsoleLog, Lincoln, Logger } from './Logging'
import { TaskRunnerAdapter } from './TaskRunnerAdapter'
import { TaskResultError } from './errors/TaskResultError'
import { TaskJobResult, EmptyTaskJobResult } from './TaskJobResult'

export interface TaskContext {
  entry: TaskEntry
  env: NodeJS.ProcessEnv
  job: TaskJob
  results: TaskJobResult[]
}

export class SerialTaskRunner implements TaskRunnerAdapter {
  readonly stdin: NodeJS.ReadStream = process.stdin
  readonly stdout: NodeJS.WriteStream = process.stdout
  readonly stderr: NodeJS.WriteStream = process.stderr

  private readonly log: Lincoln = Logger.extend('serial')

  async execute(job: TaskJob): Promise<TaskJobResult[]> {
    return job.task.entries.reduce((results, current) => {
      const ctx: TaskContext = {
        entry: current,
        env: {},
        job,
        results: [],
      }
      return results.then(() => this.run(ctx)).then(async (result: TaskJobResult) => [...(await results), result])
    }, Promise.resolve([] as TaskJobResult[]))
  }

  protected run(context: TaskContext): Promise<TaskJobResult> {
    const entry = context.entry

    ConsoleLog.info(`<${entry.command}>`, entry.arguments ? entry.arguments.join(' ') : entry.arguments)

    this.log.debug('execute', context.job.cwd, context.entry)

    switch (context.entry.type) {
      case TaskEntryType.bail:
        return Promise.resolve(EmptyTaskJobResult(context.entry))

      case TaskEntryType.env:
        const env = EmptyTaskJobResult(context.entry)
        context.env[context.entry.command] = context.entry.arguments ? context.entry.arguments[0] : undefined
        return Promise.resolve(env)

      case TaskEntryType.exec:
        return this.execContext(context)

      case TaskEntryType.skip:
        return Promise.resolve(EmptyTaskJobResult(context.entry))

      default:
        return this.spawnContext(context)
    }
  }

  protected createEnv(context: TaskContext) {
    return {
      ...process.env,
      FORCE_COLOR: 'true',
      PATH: `./node_modules/.bin:./node_modules/@nofrills/tasks/bin:${process.env.PATH}`,
      ...context.env,
    }
  }

  protected execContext(context: TaskContext): Promise<TaskJobResult> {
    const options: ExecOptions = {
      cwd: context.job.cwd,
      env: this.createEnv(context),
      windowsHide: true,
    }

    const command = [context.entry.command, ...(context.entry.arguments || [])].join(' ')

    return new Promise<TaskJobResult>((resolve, reject) => {
      exec(command, options, (error, stdout, stderr) => {
        if (error) {
          const result: TaskJobResult = {
            code: error.code || ErrorCode.UncaughtException,
            entry: context.entry,
            errors: [...this.multiline(error.message), ...this.multiline(stderr)],
            messages: [],
            signal: error.signal || null,
          }

          if (context.entry.type === TaskEntryType.bail) {
            reject(new TaskResultError(result))
          } else {
            resolve(result)
          }
        } else {
          const result: TaskJobResult = {
            code: 0,
            entry: context.entry,
            errors: [],
            messages: this.multiline(stdout),
            signal: null,
          }
          resolve(result)
        }
      })
    })
  }

  protected spawnContext(context: TaskContext): Promise<TaskJobResult> {
    const options: SpawnOptions = {
      cwd: context.job.cwd,
      env: this.createEnv(context),
      shell: context.job.task.shell || true,
      stdio: context.entry.type === TaskEntryType.capture ? [this.stdin, 'pipe', 'pipe'] : 'inherit',
      windowsHide: true,
    }

    const proc = spawn(context.entry.command, context.entry.arguments, options)

    return new Promise<TaskJobResult>((resolve, reject) => {
      const errors: string[] = []
      const messages: string[] = []

      proc
        .on('uncaughtException', (error: Error) => {
          this.log.error('uncaught-exception', context.job.name, error)
          ConsoleLog.error(error)
          reject(error)
        })
        .on('exit', (code, signal) => {
          const result: TaskJobResult = { code, errors, entry: context.entry, messages, signal }
          if (code !== 0 && context.entry.type === TaskEntryType.bail) {
            this.log.error('bail', result)
            reject(new TaskResultError(result))
          } else {
            this.log.debug(context.job.name, result)
            resolve(result)
          }
        })

      if (proc.stderr) {
        proc.stderr
          .on('error', (error: Error) => {
            errors.push(...this.multiline(error.message))
            errors.push(...(error.stack ? this.multiline(error.stack) : [error.name]))
          })
          .pipe(this.stderr)
      }

      if (proc.stdout) {
        proc.stdout
          .on('data', (data: Buffer) => {
            const message = this.multiline(data.toString())

            if (message.length > 0) {
              messages.push(...message)
            }
          })
          .pipe(this.stdout)
      }
    })
  }

  protected multiline(value: string): string[] {
    return value
      .replace('\r', '')
      .split('\n')
      .filter(line => line.length > 0)
  }
}
