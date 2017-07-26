import { Is, Types } from '@nofrills/types'

import { Lincoln, Logger } from './Logging'

import merge = require('lodash.merge')

export type Scrubber<T> = (value: T, options: ScrubsOptions, instance: Scrubs) => T
export type Scrubbers = Array<Scrubber<any>>

export interface ScrubsOptions {
  properties: string[]
  text: string
}

const defaults: ScrubsOptions = {
  properties: ['apikey', 'api_key', 'password'],
  text: '<secured>'
}

export class Scrubs {
  private readonly log: Lincoln
  private readonly options: ScrubsOptions
  private readonly registry: Map<string, Scrubbers>

  constructor(options?: ScrubsOptions) {
    this.log = Logger.extend('scrubs')
    this.options = merge({}, options, defaults)
    this.registry = new Map<string, Scrubbers>()
  }

  public clear(type: string): Scrubs {
    this.registry.set(type, [])
    return this
  }

  public get<T>(type: string): Scrubbers | undefined {
    this.log.debug('get', type)
    return this.registry.get(type)
  }

  public register<T>(type: string, scrubber: Scrubber<T>): Scrubs {
    this.log.debug('register', type)
    const scrubbers: Scrubbers | undefined = this.registry.get(type)
    if (scrubbers) {
      scrubbers.push(scrubber)
      this.registry.set(type, scrubbers)
    } else {
      this.registry.set(type, [scrubber])
    }
    return this
  }

  public scrub<T>(value: T, type?: string): T {
    if (value) {
      const typedef: string = type || Types.from(value)
      this.log.debug('scrub.pre', value, typedef)

      let result: T = value
      const scrubbers: Scrubbers | undefined = this.registry.get(typedef)
      if (scrubbers) {
        for (const scrubber of scrubbers) {
          result = scrubber(result, this.options, this)
        }
        this.log.debug('scrub.post', value, result)
        return result
      }
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
