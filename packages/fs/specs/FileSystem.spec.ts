import 'mocha'

import { expect } from 'chai'
import { Constants, FileSystem as fs } from '../src/index'

describe('when working with Files', () => {
  const cwd = process.cwd()

  before(async () => {
    const path = fs.join(cwd, '.artifacts')
    await fs.mkdir(path)
  })

  after(async () => {
    const path = fs.join(cwd, '.artifacts')
    await fs.delete(path)
  })

  it('should get base filename', () => {
    const path = fs.join(cwd, 'packages/fs/specs/FileSystem.spec.ts')
    expect(fs.basename(path)).equals('FileSystem.spec.ts')
  })

  it('should get base filename without extension', () => {
    const path = fs.join(cwd, 'packages/fs/specs/FileSystem.spec.ts')
    expect(fs.basename(path, '.ts')).equals('FileSystem.spec')
  })

  it('should list all files and directories', async () => {
    const path = fs.join(cwd, 'packages/fs/specs')
    const files = await fs.list(path)
    expect(files).contains('FileSystem.spec.ts')
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
    const path = fs.join(cwd, 'packages/fs/specs/FileSystem.spec.ts')
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
    const path = fs.join(cwd, 'packages/fs/specs/FileSystem.spec.ts')
    const exists = await fs.exists(path)
    expect(exists).equal(true)
  })

  it('should check if file does not exist', async () => {
    const path = fs.join(cwd, 'packages/fs/specs/FileSystem.spec.ts.nope')
    const exists = await fs.exists(path)
    expect(exists).equal(false)
  })

  it('should list all files recursively', async () => {
    const path = fs.join(cwd, 'node_modules/@types')
    await fs.enumerate(path, true)
  })

  it('should write json file to disk', async () => {
    const path = fs.join(cwd, '.artifacts', 'test.json')
    const json = { test: true }
    const saved = await fs.save(path, json)
    expect(saved).equals(true)
  })

  it('should fail to write json file to disk', async () => {
    const path = fs.join(cwd, '.artifacts')
    const json = { test: true }
    const saved = await fs.save(path, json)
    expect(saved).equals(false)
  })

  it('should read package.json contents', async () => {
    const path = fs.join(cwd, 'package.json')
    const json = await fs.json<{ name: string }>(path)
    expect(json.name).equals('nofrills')
  })

  it('should fail to read package2.json contents', async () => {
    try {
      const path = fs.join(cwd, 'package2.json')
      await fs.json<{}>(path)
    } catch (error) {
      expect(error).instanceof(Error)
    }
  })

  it('should read raw file into buffer', async () => {
    const path = fs.join(cwd, 'package.json')
    const fd = await fs.open(path, Constants.O_RDONLY)
    try {
      const buffer = Buffer.alloc(4096)
      const length = await fs.read(fd, buffer, 0, 4096, 0)
      const json = JSON.parse(buffer.toString(undefined, 0, length))
      expect(json.name).equals('nofrills')
    } finally {
      await fs.close(fd)
    }
  })

})
