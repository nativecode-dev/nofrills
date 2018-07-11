import * as merge from 'deepmerge'

import { Types } from '@nofrills/types'
import { Lincoln, Logger } from './Logger'

export type Scrubber<T> = (value: T, options: ScrubsOptions, instance: Scrubs) => Promise<T>
export type Scrubbers = Array<Scrubber<any>>

export interface ScrubsOptions {
  properties: string[]
  text: string
}

const defaults: Partial<ScrubsOptions> = {
  properties: ['apikey', 'api_key', 'password', 'x-api-key'],
  text: '<secured>'
}

export class Scrubs {
  private readonly log: Lincoln
  private readonly options: ScrubsOptions
  private readonly registry: Map<string, Scrubbers>

  constructor(options: Partial<ScrubsOptions> = {}) {
    this.log = Logger
    this.options = merge.all<ScrubsOptions>([options, defaults])
    this.registry = new Map<string, Scrubbers>()
  }

  public clear(type: string): Scrubs {
    this.registry.set(type, [])
    return this
  }

  public get(type: string): Scrubbers | undefined {
    this.log.debug('get', type).catch(console.error)
    return this.registry.get(type)
  }

  public register<T>(type: string, scrubber: Scrubber<T>): Scrubs {
    this.log.debug('register', type).catch(console.error)
    const scrubbers: Scrubbers | undefined = this.registry.get(type)
    if (scrubbers) {
      scrubbers.push(scrubber)
      this.registry.set(type, scrubbers)
    } else {
      this.registry.set(type, [scrubber])
    }
    return this
  }

  public async scrub<T>(value: T, type?: string): Promise<T> {
    if (value) {
      const typedef: string = type || Types.from(value)
      await this.log.debug(`scrub.pre:${typedef}`, value)

      return (this.registry.get(typedef) || []).reverse()
        .reduce(async (previous, scrubber) => scrubber(await previous, this.options, this), Promise.resolve(value))
    }
    return value
  }
}
