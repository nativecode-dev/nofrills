import { Is } from '@nofrills/types'

import { Task } from './Task'
import { TaskJob } from './TaskJob'
import { TaskJobResult } from './TaskJobResult'
import { TaskConfig } from './TaskConfig'
import { Lincoln, Logger } from './Logging'
import { TaskRunnerSerial } from './TaskRunnerSerial'
import { TaskRunnerAdapter } from './TaskRunnerAdapter'

export class TaskRunner {
  private readonly log: Lincoln = Logger.extend('run')

  constructor(private readonly config: TaskConfig, private readonly adapter: TaskRunnerAdapter = TaskRunnerSerial) {}

  async run(
    names: string[],
    cwd: string = process.cwd(),
    out: NodeJS.WriteStream = process.stdout,
    err: NodeJS.WriteStream = process.stderr,
    ins: NodeJS.ReadStream = process.stdin,
  ): Promise<TaskJobResult[]> {
    const promises = names
      .map(name => ({
        cwd,
        name,
        task: Is.array(this.config.tasks[name])
          ? ({ entries: this.config.tasks[name] } as Task)
          : (this.config.tasks[name] as Task),
      }))
      .map(job => {
        this.log.debug('task-map', job)
        return this.execute(job, out, err, ins)
      })

    const results = await Promise.all(promises)

    return results.reduce<TaskJobResult[]>((result, current) => result.concat(...current), [])
  }

  private execute(
    jobs: TaskJob,
    out: NodeJS.WriteStream,
    err: NodeJS.WriteStream,
    ins: NodeJS.ReadStream,
  ): Promise<TaskJobResult[]> {
    this.log.debug('task-exec', jobs)
    return this.adapter(jobs, this.log.extend(jobs.name), out, err, ins)
  }
}
