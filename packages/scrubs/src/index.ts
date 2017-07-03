export * from './Lincoln'
export * from './Scrubs'

import { merge } from 'lodash'
import { Registry, Scrubber, Scrubs, ScrubsOptions } from './Scrubs'

Registry.register<any[]>('array', (value: any[], options: ScrubsOptions, instance: Scrubs): any[] => {
  return value.map((v) => instance.scrub(v))
})

Registry.register<any>('object', (value: any, options: ScrubsOptions, instance: Scrubs): any => {
  const walk = (object: any): any => {
    Object.keys(object).forEach((key: string) => {
      if (options.properties.indexOf(key) >= 0) {
        object[key] = options.text
      } else if (typeof object[key] === 'object') {
        object[key] = walk(object[key])
      } else if (typeof object[key] === 'string') {
        object[key] = instance.scrub<string>(object[key])
      }
    })
    return object
  }

  if (value instanceof Date) {
    return value
  }
  const clone: any = walk(merge({}, value))
  options.log.debug('ObjectScrubber', value, clone)
  return clone
})

Registry.register<string>('string', (value: string, options: ScrubsOptions): string => {
  const regex: RegExp = new RegExp(`([${options.properties.join('|')}]=[\'"]?)\\w+([\'"]?&?)`, 'g')
  const transformed: string = value.replace(regex, `$1${options.text}$2`)
  options.log.debug('StringScrubber', value, transformed)
  return transformed
})

Registry.register<string>('string', (value: string, options: ScrubsOptions): string => {
  const regex: RegExp = /(http[s]:\/\/\w+:)\w+(@.*)/g
  const transformed: string = value.replace(regex, `$1${options.text}$2`)
  options.log.debug('StringScrubber', value, transformed)
  return transformed
})
