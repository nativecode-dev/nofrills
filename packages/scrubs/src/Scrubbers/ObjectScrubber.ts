import { ObjectNavigator } from '@nofrills/types'

import { Logger } from '../Logger'
import { Scrubs, ScrubsOptions } from '../Scrubs'

const log = Logger.extend('object-scrubber')

async function Transform(property: ObjectNavigator, options: ScrubsOptions, scrubs: Scrubs): Promise<any> {
  if (property.type === 'string' && options.properties.indexOf(property.property) >= 0) {
    await log.debug(`replacing property`, property.property, options.text)
    property.value = options.text
  } else {
    await log.debug(`scrubbing property`, property.property, property.type, property.value)
    property.value = await scrubs.scrub(property.value, property.type)
  }
  return property.value
}

export async function ObjectScrubber(value: any, options: ScrubsOptions, scrubs: Scrubs): Promise<any> {
  const navigator = ObjectNavigator.from(value)

  await Promise.all(Array.from(navigator).map(property => Transform(property, options, scrubs)))

  const transformed = navigator.toObject()
  await log.debug('ObjectScrubber', value, transformed)
  return transformed
}
