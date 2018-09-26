import { ExecOptions, SpawnOptions, exec, spawn } from 'child_process'

import { ConsoleLog, Lincoln, Logger } from './Logging'

import { ErrorCode } from './errors/ErrorCode'
import { TaskResultError } from './errors/TaskResultError'

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

      case TaskEntryType.exec:
        return this.execContext(context)

      case TaskEntryType.skip:
        return Promise.resolve(EmptyTaskJobResult(entry))

      default:
        return this.spawnContext(context)
    }
  }

  protected execContext(context: TaskContext): Promise<TaskJobResult> {
    const entry = context.entry

    const options: ExecOptions = {
      cwd: context.job.cwd,
      env: context.env,
      windowsHide: true,
    }

    const command = [entry.command, ...(entry.arguments || [])].join(' ')

    return new Promise<TaskJobResult>((resolve, reject) => {
      exec(command, options, (error, stdout, stderr) => {
        if (error) {
          const result: TaskJobResult = {
            code: error.code || ErrorCode.UncaughtException,
            entry,
            errors: [...this.multiline(error.message), ...this.multiline(stderr)],
            messages: [],
            signal: error.signal || null,
          }

          if (entry.type === TaskEntryType.bail) {
            reject(new TaskResultError(result))
          } else {
            resolve(result)
          }
        } else {
          const result: TaskJobResult = {
            code: 0,
            entry,
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
    const entry = context.entry

    const options: SpawnOptions = {
      cwd: context.job.cwd,
      env: context.env,
      shell: context.job.task.shell || true,
      stdio: entry.type === TaskEntryType.capture ? [this.stdin, 'pipe', 'pipe'] : 'inherit',
      windowsHide: true,
    }

    const proc = spawn(entry.command, entry.arguments, options)

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
          const result: TaskJobResult = { code, errors, entry, messages, signal }
          if (code !== 0 && entry.type === TaskEntryType.bail) {
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
