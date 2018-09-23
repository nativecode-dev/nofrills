import 'mocha'

import { fs } from '@nofrills/fs'

import expect from './expect'
import { TaskConfig, TaskBuilder, TaskRunner, TaskJob, TaskJobResult, TaskRunnerAdapter } from '../src/index'

const assets = fs.join(__dirname, 'assets')

describe('when using TaskRunner', () => {
  const builder = TaskBuilder.from(assets)

  const adapter: TaskRunnerAdapter = (task: TaskJob): Promise<TaskJobResult[]> => {
    return Promise.all(task.task.entries.map(job => ({ code: 0, errors: [], job, messages: [], signal: null })))
  }

  it('should execute tasks', async () => {
    const config = await builder.build()
    const runner = new TaskRunner(config, adapter)
    const results = await runner.run(['test'])
    await fs.save(fs.join(__dirname, 'assets/tasks-expanded.json'), config)
    expect(results).to.be.lengthOf(6)
  })

  it('should execute real tasks', async () => {
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

    const runner = new TaskRunner(TestTask)
    const results = await runner.run(['which'])
    expect(results).to.be.lengthOf(1)
  })

  it('should change shell to bash', async () => {
    const ShTask: TaskConfig = {
      tasks: {
        echo: {
          entries: [
            {
              arguments: ['$0'],
              command: 'echo',
              name: 'echo',
            },
          ],
        },
      },
    }

    const runner = new TaskRunner(ShTask)
    const results = await runner.run(['echo'])
    expect(results[0].messages).to.contain('/bin/sh')
  })

  it('should change shell to bash', async () => {
    const BashTask: TaskConfig = {
      tasks: {
        echo: {
          entries: [
            {
              arguments: ['$0'],
              command: 'echo',
              name: 'echo',
            },
          ],
          shell: '/bin/bash',
        },
      },
    }

    const runner = new TaskRunner(BashTask)
    const results = await runner.run(['echo'])
    expect(results[0].messages).to.contain('/bin/bash')
  })

  it('should change shell to bash', async () => {
    const BashTask: TaskConfig = {
      tasks: {
        echo: {
          entries: [
            {
              arguments: ['$0'],
              command: 'echo',
              name: 'echo',
            },
          ],
          shell: '/bin/bash',
        },
      },
    }

    const runner = new TaskRunner(BashTask)
    const results = await runner.run(['echo'])
    expect(results[0].messages).to.contain('/bin/bash')
  })
})
