import { RegistryMap } from '@nofrills/collections'
import { Is, Types } from '@nofrills/types'
import { merge } from 'lodash'

import { Lincoln, Logger } from './Logging'

export type Scrubber<T> = (value: T, options: ScrubsOptions, instance: Scrubs) => T
export type Scrubbers = Array<Scrubber<any>>

export interface ScrubsOptions {
  readonly log: Lincoln
  properties: string[]
  text: string
}

const defaults: ScrubsOptions = {
  log: Logger.extend('Scrubs'),
  properties: ['apikey', 'api_key', 'password'],
  text: '<secured>'
}

export class Scrubs {
  private readonly log: Lincoln
  private readonly options: ScrubsOptions
  private readonly registry: RegistryMap<Scrubber<any>>

  constructor(options?: ScrubsOptions) {
    this.options = merge({}, options, defaults)
    this.registry = new RegistryMap<Scrubber<any>>()

    this.log = this.options.log
  }

  public clear(type: string): Scrubs {
    this.registry.reset(type)
    return this
  }

  public get<T>(type: string): Scrubbers {
    this.options.log.debug('get', type)
    return this.registry.resolve(type)
  }

  public register<T>(type: string, scrubber: Scrubber<T>): Scrubs {
    this.options.log.debug('register', type)
    this.registry.register(type, scrubber)
    return this
  }

  public scrub<T>(value: T, type?: string): T {
    if (value) {
      type = type || Types.from(value)
      this.options.log.debug('scrub', value, type)
      let result: T = value
      const scrubbers: Scrubbers | undefined = this.registry.resolve(type)
      /* istanbul ignore next */
      if (scrubbers) {
        for (const scrubber of scrubbers) {
          result = scrubber(result, this.options, this)
        }
      }
      this.options.log.debug('scrub', value, result)
      return result
    }
    return value
  }
}

export const Registry: Scrubs = new Scrubs()

export const scrub = (value: any): any => {
  const result: any = Registry.scrub<any>(value)
  Logger.debug('scrub', value, result)
  return result
}
