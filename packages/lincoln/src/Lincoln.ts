import * as events from 'events'
import * as uuid from 'uuidjs'

import { Registry } from '@nofrills/collections'

import { Log } from './Log'
import { Options } from './Options'
import { LincolnLog } from './LincolnLog'
import { Filter, Interceptor } from './LincolnRegistry'
import { LogMessageType } from './LogMessageType'

const defaults: Options = {
  filters: new Registry<Filter>(),
  interceptors: new Registry<Interceptor>(),
  namespace: 'app',
  separator: ':'
}

export class Lincoln extends events.EventEmitter implements LincolnLog {
  public static events: { [key: string]: string } = {
    log: 'log'
  }

  public readonly id: string

  private readonly options: Options

  constructor(options?: Partial<Options> | string) {
    super()
    this.id = uuid.generate()
    if (options && typeof options === 'string') {
      options = { namespace: options }
    }
    const opts: any = options || defaults
    this.options = { ...defaults, ...opts }
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

  public extend(tag: string): Lincoln {
    return new Lincoln({
      ...this.options,
      ...{ namespace: this.tag(tag) }
    })
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

  private tag(tag: string): string {
    return `${this.options.namespace}${this.options.separator}${tag}`
  }

  private write(tag: LogMessageType, parameters: any[]): void {
    const log: Log = {
      id: uuid.generate(),
      namespace: this.tag(tag),
      parameters,
      timestamp: Date.now(),
    }

    const filters = Array.from(this.options.filters.values)
    const filtered: boolean = filters.every((filter: Filter) => filter(log))

    if (filters.length === 0 || filtered === false) {
      const interceptors = Array.from(this.options.interceptors.values)

      const logs: Log[] = interceptors.map((interceptor: Interceptor) => interceptor(log))
      this.emit(Lincoln.events.log, logs[logs.length - 1])
    }
  }
}
