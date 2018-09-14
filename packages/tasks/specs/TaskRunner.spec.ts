import 'mocha'

import { fs } from '@nofrills/fs'

import expect from './expect'
import { TaskConfig, TaskBuilder, TaskRunner, TaskJob, TaskJobResult, TaskRunnerAdapter } from '../src/index'

const assets = fs.join(__dirname, 'assets')

describe('when using TaskRunner', () => {
  const builder = TaskBuilder.from(assets)

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

  const adapter: TaskRunnerAdapter = (task: TaskJob): Promise<TaskJobResult[]> => {
    return Promise.all(task.task.entries.map(job => ({ code: 0, job, messages: [], signal: null })))
  }

  it('should execute tasks', async () => {
    const config = await builder.build()
    const runner = new TaskRunner(config, adapter)
    const results = await runner.run(['test'])
    await fs.save(fs.join(__dirname, 'assets/tasks-expanded.json'), config)
    expect(results).to.be.lengthOf(6)
  })

  it('should execute real tasks', async () => {
    const runner = new TaskRunner(TestTask)
    const results = await runner.run(['which'])
    expect(results).to.be.lengthOf(1)
  })
})
