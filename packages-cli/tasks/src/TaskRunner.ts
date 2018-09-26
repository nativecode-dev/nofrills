import { Is } from '@nofrills/types'

import { Task } from './Task'
import { TaskJob } from './TaskJob'
import { TaskJobResult } from './TaskJobResult'
import { TaskConfig } from './TaskConfig'
import { Lincoln, Logger } from './Logging'
import { TaskRunnerAdapter } from './TaskRunnerAdapter'

export class TaskRunner {
  private readonly log: Lincoln = Logger.extend('run')

  constructor(private readonly config: TaskConfig, private readonly adapter: TaskRunnerAdapter) {}

  async run(names: string[], cwd: string = process.cwd()): Promise<TaskJobResult[]> {
    this.log.debug('task-runner', names)

    const jobs = this.createTaskJobs(cwd, names)
    const results = await Promise.all(jobs.map(job => this.adapter.execute(job)))
    return results.reduce<TaskJobResult[]>((result, current) => result.concat(...current), [])
  }

  protected createTaskJobs(cwd: string, names: string[]): TaskJob[] {
    return names.map(name => ({
      cwd,
      name,
      task: Is.array(this.config.tasks[name])
        ? ({ entries: this.config.tasks[name] } as Task)
        : (this.config.tasks[name] as Task),
    }))
  }
}
