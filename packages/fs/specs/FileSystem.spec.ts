import 'mocha'

import { expect } from 'chai'
import { FileSystem as fs } from '../src/index'

describe('when working with Files', () => {
  const cwd = process.cwd()

  it('should get base filename', () => {
    const path = fs.join(cwd, 'packages/fs/specs/index.spec.ts')
    expect(fs.basename(path)).equals('index.spec.ts')
  })

  it('should get base filename without extension', () => {
    const path = fs.join(cwd, 'packages/fs/specs/index.spec.ts')
    expect(fs.basename(path, '.ts')).equals('index.spec')
  })

  it('should list all files and directories', async () => {
    const path = fs.join(cwd, 'packages/fs/specs')
    const files = await fs.list(path)
    expect(files).contains('index.spec.ts')
  })

  it('should fail to list all files and directories', async () => {
    const path = fs.join(cwd, 'nowhere')
    try {
      await fs.list(path)
    } catch (error) {
      expect(error).is.instanceof(Error)
    }
  })

  it('should get file information', async () => {
    const path = fs.join(cwd, 'packages/fs/specs/index.spec.ts')
    const info = await fs.info(path)
    expect(info.isFile()).equal(true)
  })

  it('should fail to get file information', async () => {
    const path = fs.join(cwd, 'nowhere.ts')
    try {
      await fs.info(path)
    } catch (error) {
      expect(error).is.instanceof(Error)
    }
  })

  it('should check if file exists', async () => {
    const path = fs.join(cwd, 'packages/fs/specs/index.spec.ts')
    const exists = await fs.exists(path)
    expect(exists).equal(true)
  })

  it('should check if file does not exist', async () => {
    const path = fs.join(cwd, 'packages/fs/specs/index.spec.ts.nope')
    const exists = await fs.exists(path)
    expect(exists).equal(false)
  })

  it('should list all files recursively', async () => {
    const path = fs.join(cwd, 'node_modules')
    await fs.enumerate(path, true)
  })

})
