import { EventEmitter } from 'events'

import { fs, Descriptor } from './FileSystem'

export class PathCollector extends EventEmitter {
  protected constructor(private readonly path: string) {
    super()
  }

  static from(cwd?: string): PathCollector {
    return new PathCollector(cwd || process.cwd())
  }

  async collect(patterns: string[], recursive?: boolean): Promise<Descriptor[]> {
    const descriptors = await Promise.all(
      patterns.map(pattern => fs.resolve(this.path, pattern)).map(pattern => this.resolve(pattern)),
    )

    const collected = descriptors.reduce((array, current) => array.concat(current), [])

    if (recursive) {
      const directories = collected.filter(desc => desc.stats.isDirectory()).map(desc => `${desc.path}/**`)
      const nested = await this.collect(directories)
      return nested
    }

    return collected
  }

  async resolve(pattern: string): Promise<Descriptor[]> {
    const results = await fs.glob(pattern)
    return fs.stats(...results)
  }
}
