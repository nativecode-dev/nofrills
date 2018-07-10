export * from './Registry'
export * from './Scrubs'
export * from './ScrubsInterceptor'

import { all as merge } from 'deepmerge'

import { Is } from '@nofrills/types'
import { Lincoln, Logger } from './Logger'
import { Registry } from './Registry'
import { Scrubs, ScrubsOptions } from './Scrubs'

const log: Lincoln = Logger.extend('scrubslib')

function escape(values: string[]): string[] {
  return values.map(value => value.replace('-', '\\'))
}

Registry.register<any[]>('array', (value: any[], options: ScrubsOptions, instance: Scrubs): any[] => {
  return value.map((v) => instance.scrub(v))
})

Registry.register<any>('object', (value: any, options: ScrubsOptions, instance: Scrubs): any => {
  const walk = (object: any): any => {
    Object.keys(object).forEach((key: string) => {
      if (options.properties.indexOf(key) >= 0) {
        object[key] = options.text
      } else if (Is.array(object[key]) || Is.object(object[key])) {
        object[key] = walk(object[key])
      } else if (Is.string(object[key])) {
        object[key] = instance.scrub<string>(object[key])
      } else {
        object[key] = value
      }
    })
    return object
  }

  const clone: any = walk(merge([{}, value]))
  log.debug('ObjectScrubber', value, clone)
  return clone
})

Registry.register<string>('string', (value: string, options: ScrubsOptions): string => {
  const properties = escape(options.properties)
  const regex: RegExp = new RegExp(`([${properties.join('|')}]=[\'"]?)\\w+([\'"]?&?)`, 'g')
  const transformed: string = value.replace(regex, `$1${options.text}$2`)
  log.debug('StringScrubber', value, transformed)
  return transformed
})

Registry.register<string>('string', (value: string, options: ScrubsOptions): string => {
  const regex: RegExp = /(https?:\/\/\w*:)\w+(@.*)/g
  const transformed: string = value.replace(regex, `$1${options.text}$2`)
  log.debug('UrlScrubber', value, transformed)
  return transformed
})
