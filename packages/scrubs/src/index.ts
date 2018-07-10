export * from './Registry'
export * from './Scrubs'
export * from './ScrubsInterceptor'

import { ObjectNavigator } from '@nofrills/types'
import { Lincoln, Logger } from './Logger'
import { Registry } from './Registry'
import { Scrubs, ScrubsOptions } from './Scrubs'

const log: Lincoln = Logger.extend('scrubslib')

function escape(values: string[]): string[] {
  return values.map(value => value.replace('-', '\\'))
}

Registry.register<any[]>('array', (value: any[], options: ScrubsOptions, scrubs: Scrubs): any[] => {
  const transformed = value.map(v => scrubs.scrub(v))
  log.debug('ArrayScrubber', value, transformed)
  return transformed
})

Registry.register<any>('object', (value: any, options: ScrubsOptions, scrubs: Scrubs): any => {
  const navigator = ObjectNavigator.from(value)
  Array.from(navigator).map(property => (property.value = scrubs.scrub(property.value)))
  const transformed = navigator.toObject()
  log.debug('ObjectScrubber', value, transformed)
  return transformed
})

Registry.register<string>('string', (value: string, options: ScrubsOptions): string => {
  const properties = escape(options.properties)
  const keys = properties.join('|')
  const regex: RegExp = new RegExp(`((?:${keys})=)[\'"]?([\d\s\w~!@#$%^,<>:;'"\?\+\*\?\$\.\[\]\{\}\(\)\|\/]+)[\'"]?`, 'gi')
  const transformed: string = value.replace(regex, `$1${options.text}$2`)
  log.debug('KeyValueStringScrubber', value, transformed)
  return transformed
})

Registry.register<string>('string', (value: string, options: ScrubsOptions): string => {
  const regex: RegExp = /(https?:\/\/\w*:)\w+(@.*)/gi
  const transformed: string = value.replace(regex, `$1${options.text}$2`)
  log.debug('UrlScrubber', value, transformed)
  return transformed
})
