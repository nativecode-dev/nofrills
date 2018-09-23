import { ChildProcess, spawn, SpawnOptions } from 'child_process'

import { TaskEntry } from './TaskEntry'
import { TaskEntryType } from './TaskEntryType'
import { ConsoleLog, Lincoln } from './Logging'
import { TaskResultError } from './errors/TaskResultError'
import { TaskJob } from './TaskJob'
import { TaskJobResult } from './TaskJobResult'
import { TaskRunnerAdapter } from './TaskRunnerAdapter'

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

function run(context: TaskContext): ChildProcess {
  const env = {
    ...process.env,
    FORCE_COLOR: 'true',
    PATH: `./node_modules/.bin:./node_modules/@nofrills/tasks/bin:${process.env.PATH}`,
  }

  const options: SpawnOptions = {
    cwd: context.task.cwd,
    env,
    shell: context.task.task.shell || true,
    stdio: [context.stdin, 'pipe', 'pipe'],
    windowsHide: true,
  }

  return spawn(context.job.command, context.job.arguments, options)
}

function execute(context: TaskContext): Promise<TaskJobResult> {
  if (context.job.type === TaskEntryType.skip) {
    context.log.debug('skip', context.job.name, context.job.command)
    return Promise.resolve({ code: 0, errors: [], job: context.job, messages: [], signal: null })
  }

  const errors: string[] = []
  const messages: string[] = []

  context.log.debug('execute', context.task.cwd, context.job)

  ConsoleLog.info(
    `<${context.job.command}>`,
    context.job.arguments ? context.job.arguments.join(' ') : context.job.arguments,
  )

  return new Promise<TaskJobResult>((resolve, reject) => {
    const proc = run(context)
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

    proc.stderr
      .on('error', (error: Error) => {
        errors.push(error.message)
        errors.push(error.stack || error.name)
      })
      .pipe(context.stderr)

    proc.stdout
      .on('data', (data: Buffer) => {
        messages.push(
          data
            .toString()
            .replace('\r', '')
            .replace('\n', ''),
        )
      })
      .pipe(context.stdout)
  })
}
