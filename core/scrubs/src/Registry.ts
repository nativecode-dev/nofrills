import Logger from './Logger'

import { Scrubs, ScrubsOptions } from './Scrubs'
import { ArrayScrubber, KeyValueScrubber, ObjectScrubber, UrlScrubber } from './Scrubbers/index'

export function CreateScrubs(options?: Partial<ScrubsOptions>): Scrubs {
  const scrubs = new Scrubs(options)
  scrubs.register<any[]>('array', ArrayScrubber)
  scrubs.register<any>('object', ObjectScrubber)
  scrubs.register<string>('string', KeyValueScrubber)
  scrubs.register<string>('string', UrlScrubber)
  return scrubs
}

export const Registry: Scrubs = CreateScrubs()

export const scrub = <T extends any>(value: any): T => {
  const result: T = Registry.scrub<T>(value)
  Logger.debug('scrub', value, result)
  return result
}
