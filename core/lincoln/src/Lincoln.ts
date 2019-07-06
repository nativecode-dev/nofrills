import { v4 as uuid } from 'uuid'
import { EventEmitter } from 'events'
import { Registry } from '@nofrills/collections'

import { Log } from './Log'
import { LogMessageType } from './LogMessageType'
import { LincolnLog } from './LincolnLog'
import { Filter, Interceptor } from './LincolnRegistry'
import { Options } from './Options'
import { LincolnEvents } from './LincolnEvents'

const DefaultOptions: Options = {
  emitNamespace: true,
  emitTag: true,
  filters: new Registry<Filter>(),
  interceptors: new Registry<Interceptor>(),
  namespace: 'app',
  separator: ':',
}

export class Lincoln extends EventEmitter {
  public readonly id: string

  private readonly options: Options

  constructor(logOptions?: Partial<Options> | string, private readonly loggers: LincolnLog[] = []) {
    super()
    this.id = uuid()

    if (logOptions && typeof logOptions === 'string') {
      logOptions = { namespace: logOptions }
    }

    const current: any = logOptions || DefaultOptions
    this.options = { ...DefaultOptions, ...current }
  }

  get namespace(): string {
    return this.options.namespace
  }

  debug(...parameters: any[]): void {
    this.write(LogMessageType.debug, parameters).catch(console.error)
  }

  error(...parameters: any[]): void {
    this.write(LogMessageType.error, parameters).catch(console.error)
  }

  fatal(...parameters: any[]): void {
    this.write(LogMessageType.fatal, parameters).catch(console.error)
  }

  info(...parameters: any[]): void {
    this.write(LogMessageType.info, parameters).catch(console.error)
  }

  silly(...parameters: any[]): void {
    this.write(LogMessageType.silly, parameters).catch(console.error)
  }

  trace(...parameters: any[]): void {
    this.write(LogMessageType.trace, parameters).catch(console.error)
  }

  warn(...parameters: any[]): void {
    this.write(LogMessageType.warn, parameters).catch(console.error)
  }

  extend(tag: string): Lincoln {
    return new Lincoln({
      ...this.options,
      ...{ namespace: this.normalize(tag) },
    })
  }

  now(): string {
    return new Date().toISOString()
  }

  private normalize(tag: string): string {
    if (this.options.emitNamespace && this.options.emitTag) {
      return `${this.namespace}${this.options.separator}${tag}`
    } else if (this.options.emitNamespace === false && this.options.emitTag) {
      return tag
    } else {
      return this.namespace
    }
  }

  private async write(tag: LogMessageType, parameters: any[]) {
    const original: Log = {
      id: uuid(),
      namespace: this.normalize(tag),
      parameters,
      timestamp: Date.now(),
      type: tag,
    }

    const log = await Array.from(this.options.interceptors.values).reduce(
      async (result, interceptor) => interceptor(await result),
      Promise.resolve(original),
    )

    const filtered: boolean = await Array.from(this.options.filters.values)
      .map(filter => filter(log))
      .reduce(async (result, current) => ((await result) ? result : current), Promise.resolve(false))

    if (filtered === true) {
      this.emit(LincolnEvents.Filtered, log)
      return
    }

    await Promise.all(this.loggers.map(logger => this.writer(logger, log)))

    this.emit(LincolnEvents.Log, log, this.loggers.length)
  }

  private async writer(logger: LincolnLog, log: Log) {
    if (await logger.write(log)) {
      this.emit(LincolnEvents.Written, log)
    }
  }
}
