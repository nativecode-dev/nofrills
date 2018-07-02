import * as cluster from 'cluster'

import { Files } from '@nofrills/fs'

import { Console } from './Console'
import { ConsoleOptions } from './ConsoleOptions'

export class Cluster<T extends ConsoleOptions> extends Console<T> {
  constructor(options: T, filepath: string, ...args: string[]) {
    super(options, filepath, args)

    const settings = {
      args: args,
    }

    cluster.setupMaster(settings)
  }

  async spawn(filepath: string): Promise<void> {
    const exists = await Files.exists(filepath)

    if (cluster.isMaster && exists === false) {
      return Promise.reject()
    }

    return Promise.resolve()
  }
}
