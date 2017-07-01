import * as events from 'events'
import * as uuid from 'uuid'

import { merge } from 'lodash'

export interface Log {
  readonly id: string
  readonly tag: string
  readonly timestamp: number
  namespace: string
  parameters: any[]
}

export type Filter = (log: Log) => boolean
export type Interceptor = (log: Log) => Log

export interface Options {
  filters?: Filter[]
  interceptors?: Interceptor[]
  namespace: string
}

const defaults: Options = {
  filters: [],
  interceptors: [],
  namespace: 'app',
}

const types: { [key: string]: string } = {
  debug: 'debug',
  error: 'error',
  info: 'info',
  warn: 'warn',
}

export class Lincoln extends events.EventEmitter {
  public static events: { [key: string]: string } = {
    log: 'log'
  }

  public readonly id: string

  private readonly options: Options

  constructor(options?: Options) {
    super()
    this.id = uuid.v4()
    this.options = merge({}, defaults, options)
  }

  public extend(tag: string): Lincoln {
    return new Lincoln(merge({}, this.options, {
      namespace: `${this.options.namespace}:${tag}`
    }))
  }

  public debug(...parameters: any[]): void {
    this.write(types.debug, parameters)
  }

  public error(...parameters: any[]): void {
    this.write(types.error, parameters)
  }

  public info(...parameters: any[]): void {
    this.write(types.info, parameters)
  }

  public warn(...parameters: any[]): void {
    this.write(types.warn, parameters)
  }

  private write(tag: string, parameters: any[]): void {
    const log: Log = {
      id: uuid.v4(),
      tag: `${this.options.namespace}:${tag}`,
      timestamp: Date.now(),
      namespace: this.options.namespace,
      parameters: parameters || [],
    }

    if (this.options.filters) {
      const map = this.options.filters.map((filter: Filter) => filter(log))
      const filtered = map.reduce((previous: boolean, current: boolean) => {
        return previous && current
      }, false)

      if (filtered === false) {
        if (this.options.interceptors) {
          this.options.interceptors.forEach((interceptor: Interceptor) => interceptor(log))
        }
        this.emit(Lincoln.events.log, log)
      }
    }
  }
}
