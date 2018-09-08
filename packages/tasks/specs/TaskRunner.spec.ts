import 'mocha'

import { fs } from '@nofrills/fs'

import expect from './expect'

import {
  TaskConfig,
  TaskBuilder,
  TaskRunner,
  TaskJobs,
  TaskJobResult,
  TaskRunnerAdapter,
} from '../src/index'

const assets = fs.join(__dirname, 'assets')

describe('when using TaskRunner', () => {
  const builder = new TaskBuilder(assets, 'tasks.json')

  const TaskListDir: TaskConfig = {
    tasks: {
      ls: [
        {
          arguments: ['-lah', '--color=auto'],
          command: 'ls',
          name: 'ls',
        },
      ],
    },
  }

  const adapter: TaskRunnerAdapter = (
    task: TaskJobs,
  ): Promise<TaskJobResult[]> => {
    return Promise.all(
      task.jobs.map(job => ({ code: 0, job, messages: [], signal: null })),
    )
  }

  it('should execute tasks', async () => {
    const config = await builder.build()
    const runner = new TaskRunner(config, adapter)
    const results = await runner.run(['build'])
    expect(results).to.be.lengthOf(5)
  })

  it('should execute real tasks', async () => {
    const runner = new TaskRunner(TaskListDir)
    const results = await runner.run(['ls'])
    expect(results).to.be.lengthOf(1)
  })
})
