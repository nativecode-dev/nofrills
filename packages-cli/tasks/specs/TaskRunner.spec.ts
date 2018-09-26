import 'mocha'

import { fs } from '@nofrills/fs'

import expect from './expect'
import { TaskConfig, TaskBuilder, TaskRunner, TaskJob, TaskJobResult, TaskRunnerAdapter } from '../src/index'

const assets = fs.join(__dirname, 'assets')

describe('when using TaskRunner', () => {
  const builder = TaskBuilder.file(assets)

  class TestAdapter implements TaskRunnerAdapter {
    readonly stdin: NodeJS.ReadStream = process.stdin
    readonly stdout: NodeJS.WriteStream = process.stdout
    readonly stderr: NodeJS.WriteStream = process.stderr

    execute(job: TaskJob): Promise<TaskJobResult[]> {
      return Promise.resolve(
        job.task.entries.map(entry => ({
          code: 0,
          entry,
          errors: [],
          messages: [],
          signal: null,
        })),
      )
    }
  }

  it('should execute tasks', async () => {
    const config = await builder.build()
    const runner = new TaskRunner(config, new TestAdapter())
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

    const runner = new TaskRunner(TestTask, new TestAdapter())
    const results = await runner.run(['which'])
    expect(results).to.be.lengthOf(1)
  })

  it.skip('should change shell to bash', async () => {
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

    const runner = new TaskRunner(ShTask, new TestAdapter())
    const results = await runner.run(['echo'])
    expect(results[0].messages).to.contain('/bin/sh')
  })

  it.skip('should change shell to bash', async () => {
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

    const runner = new TaskRunner(BashTask, new TestAdapter())
    const results = await runner.run(['echo'])
    expect(results[0].messages).to.contain('/bin/bash')
  })

  it.skip('should set environment variable', async () => {
    const EnvTask: TaskConfig = {
      tasks: {
        env: ['$SIMPLE test'],
      },
    }

    const env: NodeJS.ProcessEnv = { PATH: '' }
    const runner = new TaskRunner(EnvTask, new TestAdapter())
    await runner.run(['env'], undefined, env)
    console.log(env)
    expect(env.SIMPLE).to.equal('test')
  })
})
