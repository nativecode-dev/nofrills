import { Is } from '@nofrills/types'
import { serial } from '@nofrills/patterns'

import { Task } from './Task'
import { TaskJob } from './TaskJob'
import { TaskJobResult } from './TaskJobResult'
import { TaskConfig } from './TaskConfig'
import { Lincoln, Logger } from './Logging'
import { TaskRunnerAdapter } from './TaskRunnerAdapter'

export class TaskRunner {
  private readonly log: Lincoln = Logger.extend('run')

  constructor(private readonly config: TaskConfig, private readonly adapter: TaskRunnerAdapter) {}

  async run(
    names: string[],
    cwd: string = process.cwd(),
    env: NodeJS.ProcessEnv = process.env,
  ): Promise<TaskJobResult[]> {
    this.log.debug('task-runner', names)

    env.FORCE_COLOR = 'true'
    env.PATH = `./node_modules/.bin:${env.PATH}`

    const jobs = this.createTaskJobs(cwd, env, names)
    const tasks = jobs.map(job => () => this.adapter.execute(job))
    return serial(tasks, () => Promise.resolve([])).then(results =>
      results.reduce((previous, current) => previous.concat(current), []),
    )
  }

  protected createTaskJobs(cwd: string, env: NodeJS.ProcessEnv, names: string[]): TaskJob[] {
    return names.map(name => ({
      cwd,
      env,
      name,
      task: Is.array(this.config.tasks[name])
        ? ({ entries: this.config.tasks[name] } as Task)
        : (this.config.tasks[name] as Task),
    }))
  }
}
