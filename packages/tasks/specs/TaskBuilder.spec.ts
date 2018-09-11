import 'mocha'

import { fs } from '@nofrills/fs'

import expect from './expect'
import { TaskBuilder } from '../src/index'

const assets = fs.join(__dirname, 'assets')

describe('when using TaskBuilder', () => {
  it('should create builder', () => {
    expect(() => TaskBuilder.from(assets)).to.not.throw
  })

  it('should fail to create when tasks not found', () => {
    expect(() => new TaskBuilder(assets, ['undefined.json'])).to.throw
  })

  describe('to compile tasks', () => {
    const builder = TaskBuilder.from(assets)

    it('should compile tasks', async () => {
      const config = await builder.build()
      expect(config).to.not.be.undefined
    })

    it('should expand task targets', async () => {
      const config = await builder.build()
      expect(config.tasks['build']).to.be.lengthOf(5)
    })
  })
})
