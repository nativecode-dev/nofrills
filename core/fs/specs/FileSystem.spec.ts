import 'mocha'

import expect from './expect'
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
    const path = fs.join(cwd, 'core/fs/specs/FileSystem.spec.ts')
    expect(fs.basename(path)).equals('FileSystem.spec.ts')
  })

  it('should get base filename using boolean', () => {
    const path = fs.join(cwd, 'core/fs/specs/FileSystem.spec.ts')
    expect(fs.basename(path, true)).equals('FileSystem.spec.ts')
  })

  it('should get base filename with extension when no extension specified', () => {
    const path = fs.join(cwd, 'core/fs/specs/FileSystem.spec.ts')
    expect(fs.basename(path, '')).equals('FileSystem.spec.ts')
  })

  it('should get base filename without extension', () => {
    const path = fs.join(cwd, 'core/fs/specs/FileSystem.spec.ts')
    expect(fs.basename(path, '.ts')).equals('FileSystem.spec')
  })

  it('should get base filename without extension using boolean', () => {
    const path = fs.join(cwd, 'core/fs/specs/FileSystem.spec.ts')
    expect(fs.basename(path, false)).equals('FileSystem.spec')
  })

  it('should list all files and directories', async () => {
    const path = fs.join(cwd, 'core/fs/specs')
    const result = await fs.list(path)
    expect(result).to.contain('FileSystem.spec.ts')
  })

  it('should fail to list all files and directories', () => {
    const path = fs.join(cwd, 'nowhere')
    expect(fs.list(path)).to.be.rejected
  })

  it('should get file information', async () => {
    const path = fs.join(cwd, 'core/fs/specs/FileSystem.spec.ts')
    const info = await fs.info(path)
    expect(info.stats.isFile()).equal(true)
  })

  it('should fail to get file information', () => {
    const path = fs.join(cwd, 'nowhere.ts')
    expect(fs.info(path)).to.be.rejected
  })

  it('should check if file exists', async () => {
    const path = fs.join(cwd, 'core/fs/specs/FileSystem.spec.ts')
    const result = await fs.exists(path)
    expect(result).to.be.true
  })

  it('should check if file does not exist', async () => {
    const path = fs.join(cwd, 'core/fs/specs/FileSystem.spec.ts.nope')
    const result = await fs.exists(path)
    expect(result).to.be.false
  })

  it('should throw if file does not exist', () => {
    const path = fs.join(cwd, 'core/fs/specs/FileSystem.spec.ts.nope')
    expect(fs.exists(path, true)).to.be.rejected
  })

  it('should write json file to disk', async () => {
    const path = fs.join(cwd, '.cache', '.artifacts', 'test.json')
    const json = { test: true }
    const result = await fs.save(path, json)
    expect(result).to.be.true
  })

  it('should fail to write json file to disk', async () => {
    const path = fs.join(cwd, '.cache', '.artifacts')
    const json = { test: true }
    const result = await fs.save(path, json)
    expect(result).to.be.false
  })

  it('should fail to write json file to disk with error', () => {
    const path = fs.join(cwd, '.cache', '.artifacts')
    const json = { test: true }
    expect(fs.save(path, json, true)).be.rejected
  })

  it('should read package.json contents', async () => {
    const path = fs.join(cwd, 'package.json')
    const json = await fs.json<{ name: string }>(path)
    expect(json.name).equals('nofrills')
  })

  it('should fail to read package2.json contents', () => {
    const path = fs.join(cwd, 'package2.json')
    expect(fs.json<{}>(path)).to.be.rejected
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
    const path = fs.join(cwd, 'core/*')
    expect(fs.resolve(cwd, 'core/*')).equals(path)
  })

  it('should resolve glob patterns', async () => {
    const path = fs.join(cwd, 'core/*')
    const paths = await fs.glob(path)
    expect(paths).includes(fs.join(cwd, 'core/fs'))
  })

  it('should resolve glob patterns with current working directory', async () => {
    const paths = await fs.glob('core/*', cwd)
    expect(paths).includes(fs.join(cwd, 'core/fs'))
  })

  it('should error when closing invalid file descriptor', () => {
    expect(fs.close(-1, true)).to.be.rejected
  })

  it('should create deeply nested directory', async () => {
    const path = fs.join(artifacts, 'level-1/level-2/level-3')
    const created = await fs.mkdirps([path])
    expect(created).to.not.be.empty
  })

  it('should stat multiple paths', async () => {
    const paths = [fs.join(cwd, 'core/fs', 'specs'), fs.join(cwd, 'core/fs', 'src')]
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
    expect(exists).to.be.true
  })

  it('should rename file', async () => {
    const path = fs.join(artifacts, 'artifacts.json')
    const renamed = fs.join(artifacts, 'manifest.json')
    const result = await fs.rename(path, renamed)
    expect(result).to.be.true
  })

  it('should fail to rename file', async () => {
    const path = fs.join(artifacts, '.cache', '.artifacts.json')
    const renamed = fs.join(artifacts, 'manifest.json')
    const result = await fs.rename(path, renamed)
    expect(result).to.be.false
  })

  it('should fail to rename file and throw', () => {
    const path = fs.join(artifacts, '.cache', '.artifacts.json')
    const renamed = fs.join(artifacts, 'manifest.json')
    expect(fs.rename(path, renamed, true)).to.be.rejected
  })
})
