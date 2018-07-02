import 'mocha'

import { expect } from 'chai'
import { Files } from '../src/index'

describe('when working with Files', () => {
  const cwd = process.cwd()

  it('should list all files and directories', async () => {
    const path = Files.join(cwd, 'packages/fs/specs')
    const files = await Files.list(path)
    expect(files).contains('index.spec.ts')
  })

  it('should fail to list all files and directories', async () => {
    const path = Files.join(cwd, 'nowhere')
    try {
      await Files.list(path)
    } catch (error) {
      expect(error).is.instanceof(Error)
    }
  })

  it('should get file information', async () => {
    const path = Files.join(cwd, 'packages/fs/specs/index.spec.ts')
    const info = await Files.info(path)
    expect(info.isFile()).equal(true)
  })

  it('should fail to get file information', async () => {
    const path = Files.join(cwd, 'nowhere.ts')
    try {
      await Files.info(path)
    } catch (error) {
      expect(error).is.instanceof(Error)
    }
  })

  it('should check if file exists', async () => {
    const path = Files.join(cwd, 'packages/fs/specs/index.spec.ts')
    const exists = await Files.exists(path)
    expect(exists).equal(true)
  })

  it('should check if file does not exist', async () => {
    const path = Files.join(cwd, 'packages/fs/specs/index.spec.ts.nope')
    const exists = await Files.exists(path)
    expect(exists).equal(false)
  })
})
