import 'mocha'

import { fs } from '@nofrills/fs'

import expect from './expect'
import { Task, TaskBuilder, TaskConfig, TaskEntryType } from '../src/index'

const assets = fs.join(__dirname, 'assets')

describe('when using TaskBuilder', () => {
  it('should create builder', () => expect(() => TaskBuilder.file(assets)).to.not.throw)

  it('should fail to create when tasks not found', () =>
    expect(() => new TaskBuilder(assets, ['undefined.json'])).to.throw)

  describe('to compile tasks', () => {
    const builder = TaskBuilder.file(assets)

    it('should compile tasks', async () => {
      const config = await builder.build()
      expect(config).to.not.be.undefined
    })

    it('should expand task targets', async () => {
      const config = await builder.build()
      expect(config.tasks.build.entries).to.be.lengthOf(5)
    })

    it('should allow shell property', async () => {
      const config = await builder.build()
      const task = config.tasks.clean as Task
      expect(task.shell).to.be.equal('/bin/bash')
    })
  })

  describe('when using shorthand syntax', () => {
    it('should exec tasks rather than spawn', async () => {
      const ExecTask: TaskConfig = { tasks: { echo: [':echo $0'] } }
      const config = await TaskBuilder.from(ExecTask).build()
      const echo = config.tasks.echo as Task
      expect(echo.entries[0].type).to.be.equal(TaskEntryType.exec)
    })

    it('should bail on command when it fails', async () => {
      const ExecTask: TaskConfig = { tasks: { echo: ['!echo $0'] } }
      const config = await TaskBuilder.from(ExecTask).build()
      const echo = config.tasks.echo as Task
      expect(echo.entries[0].type).to.be.equal(TaskEntryType.bail)
    })

    it('should skip on command when it fails', async () => {
      const ExecTask: TaskConfig = { tasks: { echo: ['#echo $0'] } }
      const config = await TaskBuilder.from(ExecTask).build()
      const echo = config.tasks.echo as Task
      expect(echo.entries[0].type).to.be.equal(TaskEntryType.skip)
    })

    it('should capture output', async () => {
      const ExecTask: TaskConfig = { tasks: { echo: ['@echo $0'] } }
      const config = await TaskBuilder.from(ExecTask).build()
      const echo = config.tasks.echo as Task
      expect(echo.entries[0].type).to.be.equal(TaskEntryType.capture)
    })

    it('should ignore commented injects', async () => {
      const ExecTask: TaskConfig = { tasks: { echo: ['#[inject]', '@echo $0'], inject: ['pwd'] } }
      const config = await TaskBuilder.from(ExecTask).build()
      const echo = config.tasks.echo as Task
      expect(echo.entries[0].type).to.be.equal(TaskEntryType.skip)
    })
  })
})
