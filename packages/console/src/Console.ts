import { EventEmitter } from 'events'

import { IConsole } from './IConsole'
import { ConsoleOptions } from './ConsoleOptions'
import { Lincoln, Logger } from './Logger'
import { ProcessArgs } from './ProcessArgs'

type Rejector = (reason?: any) => void
type Resolver = (value?: void | PromiseLike<void> | undefined) => void

export class Console<T extends ConsoleOptions> extends EventEmitter implements IConsole {
  private readonly logger: Lincoln = Logger

  private instance: Promise<void> | undefined

  protected constructor(protected readonly options: T, public readonly args: ProcessArgs) {
    super()
  }

  static create<T extends ConsoleOptions>(options: T, args?: ProcessArgs): Console<T> {
    return new Console<T>(options, args || ProcessArgs.from(process.argv))
  }

  static run<T extends ConsoleOptions>(options: T, args: ProcessArgs): Promise<void> {
    return Console.create<T>(options, args).start()
  }

  async start(): Promise<void> {
    if (this.instance === undefined) {
      this.logger.info(`starting "${this.args.exe}":`, ...this.args.normalized)
      return (this.instance = new Promise<void>(async (resolve, reject) => {
        process.on('uncaughtException', () => this.shutdown(resolve, reject, 'uncaught-exception'))

        process.on('exit', () => this.shutdown(resolve, reject, 'exit'))

        if (this.options.initializer) {
          await this.options.initializer(this, ...this.args.normalized)
        }
      }))
    }

    return this.instance
  }

  stop(): void {
    process.exit(0)
  }

  private shutdown = async (resolve: Resolver, reject: Rejector, reason: string) => {
    this.logger.info('[SHUTDOWN]', process.pid, process.exitCode, reason)

    if (process.exitCode && process.exitCode !== 0) {
      reject(new Error(`${process.exitCode}: ${reason}`))
    } else {
      resolve()
    }
  }
}
