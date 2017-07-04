import * as events from 'events'
import * as uuid from 'uuidjs'

import { merge } from 'lodash'

import { Dictionary } from '@nofrills/collections'
import { Debug } from './Interceptors'
import { Log } from './Log'
import { Options } from './Options'
import { Filter, Interceptor } from './Types'

const defaults: Options = {
  filters: [],
  interceptors: [],
  namespace: 'app',
  separator: ':'
}

const types: Dictionary<string> = {
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

  constructor(options?: Partial<Options> | string) {
    super()
    this.id = uuid.generate()
    if (options && typeof options === 'string') {
      options = {
        interceptors: [Debug],
        namespace: options,
      }
    }
    this.options = merge({}, defaults, options)
  }

  public get namespace(): string {
    return this.options.namespace
  }

  public debug(...parameters: any[]): void {
    this.write(types.debug, parameters)
  }

  public error(...parameters: any[]): void {
    this.write(types.error, parameters)
  }

  public extend(tag: string): Lincoln {
    return new Lincoln(merge({}, this.options, {
      namespace: this.tag(tag),
    }))
  }

  public info(...parameters: any[]): void {
    this.write(types.info, parameters)
  }

  public warn(...parameters: any[]): void {
    this.write(types.warn, parameters)
  }

  private tag(tag: string): string {
    return `${this.options.namespace}${this.options.separator}${tag}`
  }

  private write(tag: string, parameters: any[]): void {
    const log: Log = {
      id: uuid.generate(),
      namespace: this.tag(tag),
      parameters: parameters || [],
      timestamp: Date.now(),
    }

    const reducer = (previous: boolean, current: boolean) => previous || current

    if (this.options.filters) {
      let filtered: boolean = false

      if (this.options.filters.length) {
        const map = this.options.filters.map((filter: Filter) => filter(log))

        filtered = map.reduce(reducer, false)
      }

      if (filtered === false) {
        if (this.options.interceptors) {
          this.options.interceptors.forEach((interceptor: Interceptor) => interceptor(log))
        }
        this.emit(Lincoln.events.log, log)
      }
    }
  }
}
