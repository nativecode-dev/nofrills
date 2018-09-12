import { ChildProcess, spawn, SpawnOptions } from 'child_process'

import { Task } from './Task'
import { Lincoln } from './Logging'
import { TaskRunnerAdapter, TaskJobs, TaskJobResult } from './TaskRunner'

export interface TaskContext {
  job: Task
  log: Lincoln
  task: TaskJobs
  stderr: NodeJS.WriteStream
  stdout: NodeJS.WriteStream
}

export const TaskRunnerSerial: TaskRunnerAdapter = (
  task: TaskJobs,
  log: Lincoln,
  out: NodeJS.WriteStream,
  err: NodeJS.WriteStream,
): Promise<TaskJobResult[]> => {
  return task.jobs.reduce(
    (results, job) =>
      results
        .then(() => execute({ job, log: log.extend(job.command), task, stdout: out, stderr: err }))
        .then(async result => [...(await results), result]),
    Promise.resolve([] as TaskJobResult[]),
  )
}

function run(context: TaskContext): ChildProcess {
  const env = {
    ...process.env,
    PATH: `./node_modules/.bin:./node_modules/@nofrills/tasks/bin:${process.env.PATH}`,
  }

  const options: SpawnOptions = {
    cwd: context.task.cwd,
    env,
    shell: true,
    stdio: 'inherit',
    windowsHide: true,
  }

  return spawn(context.job.command, context.job.arguments, options)
}

function execute(context: TaskContext): Promise<TaskJobResult> {
  if (context.job.command.startsWith('#')) {
    context.log.debug('skip', context.job.name, context.job.command)

    return Promise.resolve({ code: 0, job: context.job, messages: [], signal: null })
  }

  return new Promise<TaskJobResult>((resolve, reject) => {
    const messages: string[] = []
    const proc = run(context)

    context.log.debug('serial-task', context.task.cwd, context.job.name, context.job.command, context.job.arguments)

    proc.on('uncaughtException', (error: Error) => {
      context.log.error('uncaught-exception', context.job.name, error)
      reject(error)
    })

    proc.on('exit', (code, signal) => {
      const results = { code, job: context.job, messages, signal }
      context.log.debug(context.job.name, results)
      resolve(results)
    })
  })
}
