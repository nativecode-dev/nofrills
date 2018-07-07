import * as events from 'events'
import * as uuid from 'uuidjs'

import { Chain, Chains, Registry } from '@nofrills/collections'

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
    log: 'log-message'
  }

  public readonly id: string

  private readonly options: Options

  constructor(options?: Partial<Options> | string) {
    super()

    this.id = uuid.generate()

    if (options && typeof options === 'string') {
      options = { namespace: options }
    }

    const current: any = options || defaults
    this.options = { ...defaults, ...current }
  }

  protected get filters(): Chain<Log, boolean> {
    return new Chain<Log, boolean>(Array.from(this.options.filters.values))
  }

  protected get interceptors(): Chains<Log> {
    return new Chain<Log, Log>(Array.from(this.options.interceptors.values))
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

    const filtered: boolean = this.filters.execute(log)

    if (filtered === false) {
      return
    }

    const logitem = this.interceptors.execute(log)

    this.emit(Lincoln.events.log, logitem)
  }
}
