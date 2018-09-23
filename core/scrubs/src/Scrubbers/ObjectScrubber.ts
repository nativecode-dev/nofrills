import { ObjectNavigator } from '@nofrills/types'

import { Logger } from '../Logger'
import { Scrubs, ScrubsOptions } from '../Scrubs'

const Key = 'object-scrubber'

const log = Logger.extend(Key)

async function transform(property: ObjectNavigator, options: ScrubsOptions, scrubs: Scrubs): Promise<any> {
  log.debug('transform', property.property, property.type, property.value)
  if (property.type === 'string' && options.properties.some(p => p === property.property)) {
    log.debug(`replacing property`, property.property, options.text)
    return (property.value = options.text)
  }

  log.debug(`scrubbing property`, property.property, property.type, property.value)
  return (property.value = await scrubs.scrub(property.value, property.type))
}

export async function ObjectScrubber(value: any, options: ScrubsOptions, scrubs: Scrubs): Promise<any> {
  const navigator = ObjectNavigator.from(value)
  const transformations = Array.from(navigator).map(property => transform(property, options, scrubs))

  await Promise.all(transformations)

  const transformed = navigator.toObject()
  log.debug('transformed', value, transformed)
  return transformed
}
