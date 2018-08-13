import 'mocha'

import { expect } from 'chai'
import { Constants, fs } from '../src/index'

describe('when working with Files', () => {
  const cwd = process.cwd()
  const artifacts = fs.join(cwd, '.cache', '.artifacts')

  before(async () => {
    if (await fs.exists(artifacts)) {
      await fs.delete(artifacts)
    }
    await fs.mkdir(artifacts)
    await fs.save(fs.join(artifacts, 'artifacts.json'), JSON.stringify({ path: artifacts }))
  })

  after(() => fs.delete(artifacts))

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
    expect(info.stats.isFile()).equal(true)
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

  it('should throw if file does not exist', async () => {
    try {
      const path = fs.join(cwd, 'packages/fs/specs/FileSystem.spec.ts.nope')
      await fs.exists(path, true)
      throw new Error('failed to fail')
    } catch (error) {
      expect(error.message).not.equal('failed to fail')
    }
  })

  it('should write json file to disk', async () => {
    const path = fs.join(cwd, '.cache', '.artifacts', 'test.json')
    const json = { test: true }
    const saved = await fs.save(path, json)
    expect(saved).equals(true)
  })

  it('should fail to write json file to disk', async () => {
    const path = fs.join(cwd, '.cache', '.artifacts')
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

  it('should resolve path', () => {
    const path = fs.join(cwd, 'packages/*')
    expect(fs.resolve(cwd, 'packages/*')).equals(path)
  })

  it('should resolve glob patterns', async () => {
    const path = fs.join(cwd, 'packages/*')
    const paths = await fs.glob(path)
    expect(paths).includes(fs.join(cwd, 'packages/fs'))
  })

  it('should resolve glob patterns with current working directory', async () => {
    const paths = await fs.glob('packages/*', cwd)
    expect(paths).includes(fs.join(cwd, 'packages/fs'))
  })

  it('should error when closing invalid file descriptor', async () => {
    try {
      await fs.close(-1, true)
    } catch (error) {
      expect(error).instanceof(Error)
    }
  })

  it('should create deeply nested directory', async () => {
    const path = fs.join(artifacts, 'level-1/level-2/level-3')
    await fs.mkdirp(path)
    expect(await fs.exists(path)).equals(true)
  })

  it('should stat multiple paths', async () => {
    const paths = [
      fs.join(cwd, 'packages/fs', 'specs'),
      fs.join(cwd, 'packages/fs', 'src'),
    ]
    const stats = await fs.stats(...paths)
    expect(stats.length).to.equal(2)
  })

  it('should write json data', async () => {
    const path = fs.join(artifacts, 'env.json')
    const fd = await fs.open(path, 'w')
    const buffer = Buffer.from(JSON.stringify(process.env))
    await fs.write(fd, buffer, 0, buffer.length, 0)
    await fs.close(fd)
    const exists = await fs.exists(path)
    expect(exists).to.equal(true)
  })

  it('should rename file', async () => {
    const path = fs.join(artifacts, 'artifacts.json')
    const renamed = fs.join(artifacts, 'manifest.json')
    const result = await fs.rename(path, renamed)
    expect(result).to.equal(true)
  })

  it('should fail to rename file', async () => {
    const path = fs.join(artifacts, '.cache', '.artifacts.json')
    const renamed = fs.join(artifacts, 'manifest.json')
    const result = await fs.rename(path, renamed)
    expect(result).to.equal(false)
  })

  it('should fail to rename file and throw', async () => {
    try {
      const path = fs.join(artifacts, '.cache', '.artifacts.json')
      const renamed = fs.join(artifacts, 'manifest.json')
      await fs.rename(path, renamed, true)
    } catch (error) {
      expect(error).instanceof(Error)
    }
  })

})
