import { Logger } from '../Logger'
import { Scrubs, ScrubsOptions } from '../Scrubs'

const log = Logger.extend('array-scrubber')

export async function ArrayScrubber(value: any[], options: ScrubsOptions, scrubs: Scrubs): Promise<any[]> {
  const transformed = await Promise.all(value.map(v => scrubs.scrub(v)))
  log.debug('transformed', value, transformed)
  return transformed
}