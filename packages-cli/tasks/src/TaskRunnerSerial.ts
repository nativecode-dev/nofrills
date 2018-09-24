import { ExecOptions, SpawnOptions, exec, spawn } from 'child_process'

import { TaskEntry } from './TaskEntry'
import { TaskEntryType } from './TaskEntryType'
import { ConsoleLog, Lincoln } from './Logging'
import { TaskResultError } from './errors/TaskResultError'
import { TaskJob } from './TaskJob'
import { TaskJobResult } from './TaskJobResult'
import { TaskRunnerAdapter } from './TaskRunnerAdapter'
import { ErrorCode } from './errors'

export interface TaskContext {
  job: TaskEntry
  log: Lincoln
  task: TaskJob
  stderr: NodeJS.WriteStream
  stdin: NodeJS.ReadStream
  stdout: NodeJS.WriteStream
}

export const TaskRunnerSerial: TaskRunnerAdapter = (
  task: TaskJob,
  log: Lincoln,
  out: NodeJS.WriteStream,
  err: NodeJS.WriteStream,
  ins: NodeJS.ReadStream,
): Promise<TaskJobResult[]> => {
  return task.task.entries.reduce(
    (results, job) =>
      results
        .then(() => execute({ job, log: log.extend(job.command), task, stdout: out, stderr: err, stdin: ins }))
        .then(async (result: TaskJobResult) => [...(await results), result]),
    Promise.resolve([] as TaskJobResult[]),
  )
}

function createEnv() {
  return {
    ...process.env,
    FORCE_COLOR: 'true',
    PATH: `./node_modules/.bin:./node_modules/@nofrills/tasks/bin:${process.env.PATH}`,
  }
}

function execContext(context: TaskContext): Promise<TaskJobResult> {
  const options: ExecOptions = {
    cwd: context.task.cwd,
    env: createEnv(),
    windowsHide: true,
  }

  const command = [context.job.command, ...(context.job.arguments || [])].join(' ')

  return new Promise<TaskJobResult>((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        const result = {
          code: error.code || ErrorCode.UncaughtException,
          errors: [...multiline(error.message), ...multiline(stderr)],
          job: context.job,
          messages: [],
          signal: error.signal || null,
        }

        if (context.job.type === TaskEntryType.bail) {
          reject(new TaskResultError(result))
        } else {
          resolve(result)
        }
      } else {
        const result = {
          code: 0,
          errors: [],
          job: context.job,
          messages: multiline(stdout),
          signal: null,
        }
        resolve(result)
      }
    })
  })
}

function spawnContext(context: TaskContext): Promise<TaskJobResult> {
  const options: SpawnOptions = {
    cwd: context.task.cwd,
    env: createEnv(),
    shell: context.task.task.shell || true,
    stdio: context.job.type === TaskEntryType.capture ? [context.stdin, 'pipe', 'pipe'] : 'inherit',
    windowsHide: true,
  }

  const proc = spawn(context.job.command, context.job.arguments, options)

  return new Promise<TaskJobResult>((resolve, reject) => {
    const errors: string[] = []
    const messages: string[] = []

    proc
      .on('uncaughtException', (error: Error) => {
        context.log.error('uncaught-exception', context.job.name, error)
        ConsoleLog.error(error)
        reject(error)
      })
      .on('exit', (code, signal) => {
        const result = { code, errors, job: context.job, messages, signal }
        if (code !== 0 && context.job.type === TaskEntryType.bail) {
          context.log.error('bail', result)
          reject(new TaskResultError(result))
        } else {
          context.log.debug(context.job.name, result)
          resolve(result)
        }
      })

    if (proc.stderr) {
      proc.stderr
        .on('error', (error: Error) => {
          errors.push(...multiline(error.message))
          errors.push(...(error.stack ? multiline(error.stack) : [error.name]))
        })
        .pipe(context.stderr)
    }

    if (proc.stdout) {
      proc.stdout
        .on('data', (data: Buffer) => {
          const message = multiline(data.toString())

          if (message.length > 0) {
            messages.push(...message)
          }
        })
        .pipe(context.stdout)
    }
  })
}

function execute(context: TaskContext): Promise<TaskJobResult> {
  if (context.job.type === TaskEntryType.skip) {
    context.log.debug('skip', context.job.name, context.job.command)
    return Promise.resolve({ code: 0, errors: [], job: context.job, messages: [], signal: null })
  }

  ConsoleLog.info(
    `<${context.job.command}>`,
    context.job.arguments ? context.job.arguments.join(' ') : context.job.arguments,
  )

  context.log.debug('execute', context.task.cwd, context.job)

  return context.job.type === TaskEntryType.exec ? execContext(context) : spawnContext(context)
}

function multiline(value: string): string[] {
  return value
    .replace('\r', '')
    .split('\n')
    .filter(line => line.length > 0)
}
