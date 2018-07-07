import { generate as uuid } from 'uuidjs'

import { EventEmitter } from 'events'
import { Registry } from '@nofrills/collections'

import { Log } from './Log'
import { LogMessageType } from './LogMessageType'
import { LincolnLog } from './LincolnLog'
import { Filter, Interceptor } from './LincolnRegistry'
import { Options } from './Options'

const defaults: Options = {
  filters: new Registry<Filter>(),
  interceptors: new Registry<Interceptor>(),
  namespace: 'app',
  separator: ':'
}

export enum LincolnEvents {
  Filtered = 'log-message-filtered',
  Log = 'log-message',
}

export class Lincoln extends EventEmitter {
  public readonly id: string

  private readonly options: Options

  constructor(
    logOptions?: Partial<Options> | string,
    private readonly loggers: LincolnLog[] = [],
  ) {
    super()
    this.id = uuid()

    if (logOptions && typeof logOptions === 'string') {
      logOptions = { namespace: logOptions }
    }

    const current: any = logOptions || defaults
    this.options = { ...defaults, ...current }
  }

  public get namespace(): string {
    return this.options.namespace
  }

  public debug(...parameters: any[]): void {
    this.write(LogMessageType.debug, parameters)
  }

  public error(...parameters: any[]): void {
    this.write(LogMessageType.error, parameters)
  }

  public fatal(...parameters: any[]): void {
    this.write(LogMessageType.fatal, parameters)
  }

  public info(...parameters: any[]): void {
    this.write(LogMessageType.info, parameters)
  }

  public silly(...parameters: any[]): void {
    this.write(LogMessageType.silly, parameters)
  }

  public trace(...parameters: any[]): void {
    this.write(LogMessageType.trace, parameters)
  }

  public warn(...parameters: any[]): void {
    this.write(LogMessageType.warn, parameters)
  }

  public extend(tag: string): Lincoln {
    return new Lincoln({
      ...this.options,
      ...{ namespace: this.normalize(tag) }
    })
  }

  private normalize(tag: string): string {
    return `${this.options.namespace}${this.options.separator}${tag}`
  }

  private write(tag: LogMessageType, parameters: any[]): void {
    const original: Log = {
      id: uuid(),
      namespace: this.normalize(tag),
      parameters,
      timestamp: Date.now(),
      type: tag,
    }

    const log = Array.from(this.options.interceptors.values)
      .reduce((result, interceptor) => interceptor(result), original)

    const filtered: boolean = Array.from(this.options.filters.values)
      .map(filter => filter(log))
      .reduce((result, filter) => result ? result : filter, false)

    if (filtered === true) {
      this.emit(LincolnEvents.Filtered, log)
      return
    }

    this.emit(LincolnEvents.Log, log)

    this.loggers.map(logger => logger.write(log))
  }
}
