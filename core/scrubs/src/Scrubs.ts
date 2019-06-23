import merge from 'deepmerge'

import { Types } from '@nofrills/types'

import Logger from './Logger'

export type Scrubber<T> = (value: T, options: ScrubsOptions, instance: Scrubs) => Promise<T>
export type Scrubbers = Array<Scrubber<any>>

export interface ScrubsOptions {
  properties: string[]
  text: string
}

const defaults: Partial<ScrubsOptions> = {
  properties: ['apikey', 'api-key', 'api_key', 'pass', 'password', 'secret', 'x-api-key'],
  text: '<secured>',
}

export class Scrubs {
  private readonly log = Logger
  private readonly options: ScrubsOptions
  private readonly registry: Map<string, Scrubbers>

  constructor(options: Partial<ScrubsOptions> = {}) {
    this.options = merge.all([defaults, options]) as ScrubsOptions
    this.registry = new Map<string, Scrubbers>()
  }

  clear(type: string): Scrubs {
    this.registry.set(type, [])
    return this
  }

  get(type: string): Scrubbers | undefined {
    this.log.debug('get', type)
    return this.registry.get(type)
  }

  properties(names: string[]) {
    this.options.properties = this.options.properties.slice().concat(names)
  }

  register<T>(type: string, scrubber: Scrubber<T>): Scrubs {
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

  async scrub<T>(value: T, type?: string): Promise<T> {
    if (value) {
      const typedef: string = type || Types.from(value)
      this.log.debug(`scrub.pre:${typedef}`, value)

      return (this.registry.get(typedef) || [])
        .reverse()
        .reduce(async (previous, scrubber) => scrubber(await previous, this.options, this), Promise.resolve(value))
    }
    return value
  }
}
