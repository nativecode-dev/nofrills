import { EventEmitter } from 'events'

import { ConsoleOptions } from './ConsoleOptions'
import { Lincoln, Logger } from './Logger'

type Rejector = (reason?: any) => void
type Resolver = (value?: void | PromiseLike<void> | undefined) => void

export abstract class Console<T extends ConsoleOptions> extends EventEmitter {
  private readonly logger: Lincoln = Logger

  private instance: Promise<void> | undefined

  constructor(protected readonly options: T) {
    super()
  }

  start(exe: string, ...args: string[]): Promise<void> {
    if (this.instance === undefined) {
      this.logger.info(`starting "${exe}":`, ...args)
      return (this.instance = new Promise<void>((resolve, reject) => {
        process.on('uncaughtException', () => this.shutdown(resolve, reject, 'uncaught-exception'))
        process.on('exit', () => this.shutdown(resolve, reject, 'exit'))
        this.initialize()
      }))
    }

    return this.instance
  }

  stop(): void {
    process.exit(0)
  }

  protected abstract initialize(): void

  private shutdown = (resolve: Resolver, reject: Rejector, reason: string): void => {
    this.logger.info('SHUTDOWN', `(${process.pid}::${process.exitCode}::${reason})`)
    if (process.exitCode === 0) {
      reject(reason)
    }
    resolve()
  }
}
