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

  const TestTask: TaskConfig = {
    tasks: {
      which: [
        {
          arguments: ['node'],
          command: 'which',
          name: 'which',
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

  it.skip('should execute real tasks', async () => {
    const runner = new TaskRunner(TestTask)
    const results = await runner.run(['which'])
    expect(results).to.be.lengthOf(1)
  })
})
