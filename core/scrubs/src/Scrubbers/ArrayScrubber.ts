import Logger from '../Logger'

import { Scrubs, ScrubsOptions } from '../Scrubs'

const log = Logger.extend('array-scrubber')

export function ArrayScrubber(value: any[], options: ScrubsOptions, scrubs: Scrubs): any[] {
  const transformed = value.map((v) => scrubs.scrub(v))
  log.debug('transformed', value, transformed)
  return transformed
}
