import { Task } from './Task'
import { TaskConfig } from './TaskConfig'
import { Lincoln, Logger } from './Logging'
import { TaskRunnerSerial } from './TaskRunnerSerial'

export interface TaskJobs {
  cwd: string
  name: string
  jobs: Task[]
}

export interface TaskJobResult {
  code: number
  job: Task
  messages: string[]
  signal: string | null
}

export type TaskRunnerAdapter = (
  task: TaskJobs,
  log: Lincoln,
  out: NodeJS.WriteStream,
  err: NodeJS.WriteStream,
) => Promise<TaskJobResult[]>

export class TaskRunner {
  private readonly log: Lincoln = Logger.extend('run')

  constructor(private readonly config: TaskConfig, private readonly adapter: TaskRunnerAdapter = TaskRunnerSerial) {}

  async run(
    names: string[],
    cwd: string = process.cwd(),
    out: NodeJS.WriteStream = process.stdout,
    err: NodeJS.WriteStream = process.stderr,
  ): Promise<TaskJobResult[]> {
    const promises = names
      .map<TaskJobs>(task => ({ cwd, name: task, jobs: this.config.tasks[task] as Task[] }))
      .map(task => {
        this.log.debug('task-map', task.name)
        return this.execute(task, out, err)
      })

    const results = await Promise.all(promises)

    return results.reduce<TaskJobResult[]>((result, current) => result.concat(...current), [])
  }

  private execute(task: TaskJobs, out: NodeJS.WriteStream, err: NodeJS.WriteStream): Promise<TaskJobResult[]> {
    this.log.debug('task-exec', task.name, task.jobs)
    return this.adapter(task, this.log.extend(task.name), out, err)
  }
}
