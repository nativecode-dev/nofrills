import { ObjectNavigator } from '@nofrills/types'

import Logger from '../Logger'

import { Scrubs, ScrubsOptions } from '../Scrubs'

const Key = 'object-scrubber'

const log = Logger.extend(Key)

function transform(property: ObjectNavigator, options: ScrubsOptions, scrubs: Scrubs): any {
  log.debug('transform', property.property, property.type, property.value)
  if (property.type === 'string' && options.properties.some(p => p === property.property)) {
    log.debug(`replacing property`, property.property, options.text)
    return (property.value = options.text)
  }

  log.debug(`scrubbing property`, property.property, property.type, property.value)
  return (property.value = scrubs.scrub(property.value, property.type))
}

export function ObjectScrubber(value: any, options: ScrubsOptions, scrubs: Scrubs): any {
  const navigator = ObjectNavigator.from(value)
  Array.from(navigator).map(property => transform(property, options, scrubs))

  const transformed = navigator.toObject()
  log.debug('transformed', value, transformed)
  return transformed
}
