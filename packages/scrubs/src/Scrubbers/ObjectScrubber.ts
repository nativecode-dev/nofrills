import { ObjectNavigator } from '@nofrills/types'

import { Logger } from '../Logger'
import { Scrubs, ScrubsOptions } from '../Scrubs'

const log = Logger.extend('object-scrubber')

export async function ObjectScrubber(value: any, options: ScrubsOptions, scrubs: Scrubs): Promise<any> {
  const navigator = ObjectNavigator.from(value)
  await Promise.all(Array.from(navigator).map(async property => {
    property.value = await scrubs.scrub(property.value)
    return property
  }))
  const transformed = navigator.toObject()
  await log.debug('ObjectScrubber', value, transformed)
  return transformed
}
