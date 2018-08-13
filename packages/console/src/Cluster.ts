import * as cluster from 'cluster'

import { fs } from '@nofrills/fs'

import { Console } from './Console'
import { ConsoleOptions } from './ConsoleOptions'

export class Cluster<T extends ConsoleOptions> extends Console<T> {
  protected constructor(options: T, filepath: string, args: string[]) {
    super(options, filepath, args)

    const settings = {
      args: args,
    }

    cluster.setupMaster(settings)
  }

  static create<T extends ConsoleOptions>(options: T, filepath: string, ...args: string[]): Console<T> {
    return new Cluster(options, filepath, args)
  }

  async spawn(filepath: string): Promise<boolean> {
    const exists = await fs.exists(filepath)

    if (cluster.isMaster && exists === false) {
      return Promise.reject(false)
    }

    return Promise.resolve(true)
  }
}
