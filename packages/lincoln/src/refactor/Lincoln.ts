import { Is } from '@nofrills/types'
import { generate as uuid } from 'uuidjs'

import { Log } from './Log'
import { LogProcessor } from './LogProcessor'
import { LincolnOptions } from './LincolnOptions'
import { LogMessageType } from './LogMessageType'

const DefaultOptions: LincolnOptions = {
  namespace: 'lincoln',
  separator: ':',
}

export class Lincoln {
  readonly id: string = uuid()
  readonly options: LincolnOptions

  private constructor(
    private readonly processor: LogProcessor,
    options: string | Partial<LincolnOptions>,
  ) {
    if (Is.object(options)) {
      this.options = Object.assign({}, DefaultOptions, { namespace: options })
    } else {
      this.options = Object.assign({}, DefaultOptions, options)
    }
  }

  static from(processor: LogProcessor, options: string | Partial<LincolnOptions>): Lincoln {
    return new Lincoln(processor, options)
  }

  get namespace(): string {
    return this.options.namespace
  }

  debug(...parameters: any[]): void {
    this.transform(LogMessageType.debug, parameters)
  }

  error(...parameters: any[]): void {
    this.transform(LogMessageType.error, parameters)
  }

  fatal(...parameters: any[]): void {
    this.transform(LogMessageType.fatal, parameters)
  }

  info(...parameters: any[]): void {
    this.transform(LogMessageType.info, parameters)
  }

  silly(...parameters: any[]): void {
    this.transform(LogMessageType.silly, parameters)
  }

  trace(...parameters: any[]): void {
    this.transform(LogMessageType.trace, parameters)
  }

  warn(...parameters: any[]): void {
    this.transform(LogMessageType.warn, parameters)
  }

  extend(tag: string): Lincoln {
    const options = {
      ...this.options,
      ...{ namespace: this.normalize(tag) },
    }

    return new Lincoln(this.processor, options)
  }

  private normalize(tag: string): string {
    return `${this.options.namespace}${this.options.separator}${tag}`
  }

  private transform(tag: LogMessageType, parameters: any[]): void {
    const log: Log = {
      id: uuid(),
      namespace: this.normalize(tag),
      parameters,
      timestamp: Date.now(),
      type: tag,
    }

    this.processor.process(log)
  }
}
