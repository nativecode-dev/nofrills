import cluster from 'cluster'

import { fs } from '@nofrills/fs'

import { Console } from './Console'
import { ProcessArgs } from './ProcessArgs'
import { ConsoleOptions } from './ConsoleOptions'

export class Cluster<T extends ConsoleOptions> extends Console<T> {
  protected constructor(options: T, args: ProcessArgs) {
    super(options, args)

    const settings: cluster.ClusterSettings = { args: args.normalized }
    cluster.setupMaster(settings)
  }

  static create<T extends ConsoleOptions>(options: T, args: ProcessArgs): Console<T> {
    return new Cluster(options, args)
  }

  async spawn(filepath: string): Promise<boolean> {
    const exists = await fs.exists(filepath)

    if (cluster.isMaster && exists === false) {
      return Promise.reject(false)
    }

    return Promise.resolve(true)
  }
}
