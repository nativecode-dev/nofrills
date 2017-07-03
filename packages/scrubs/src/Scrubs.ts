import { Registry as RegistryMap } from '@nofrills/collections'
import { Lincoln } from '@nofrills/lincoln'
import { merge } from 'lodash'
import { Logger } from './Logging'

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
  private readonly registry: RegistryMap<Scrubbers>

  constructor(options?: ScrubsOptions) {
    this.options = merge({}, options, defaults)
    this.registry = new RegistryMap<Scrubbers>()

    this.log = this.options.log
  }

  public clear(type: string): Scrubs {
    this.registry.register(type, [])
    return this
  }

  public get<T>(type: string): Array<Scrubber<T>> | undefined {
    this.options.log.debug('get', type)
    return this.registry.resolve(type)
  }

  public register<T>(type: string, scrubber: Scrubber<T>): Scrubs {
    this.options.log.debug('register', type)
    let scrubbers = this.registry.resolve(type)
    if (scrubbers === undefined) {
      scrubbers = [scrubber]
    } else {
      scrubbers.push(scrubber)
    }
    this.registry.register(type, scrubbers)
    return this
  }

  public scrub<T>(value: T, type?: string): T {
    type = type || typeof value
    this.options.log.debug('scrub', value, type)
    let result: T = value
    const scrubbers: Scrubbers | undefined = this.registry.resolve(type)
    if (scrubbers) {
      for (const scrubber of scrubbers) {
        result = scrubber(result, this.options, this)
      }
    }
    this.options.log.debug('scrub', value, result)
    return result
  }
}

export const Registry: Scrubs = new Scrubs()
export const scrub = (value: any): any => {
  const result: any = Registry.scrub<any>(value)
  Logger.debug('scrub', value, result)
  return result
}
