import Logger from '../Logger'

import { ScrubsOptions } from '../Scrubs'

const log = Logger.extend('key-value-scrubber')

export function KeyValueScrubber(value: string, options: ScrubsOptions): string {
  const properties = options.properties.map((v) => v.replace(/(-)/g, '\\-'))
  const keys = properties.join('|')
  const pattern = `((${keys})\\s*=)\\s*['"]?([\\d\\s\\w~!@#$%^,-<>:;\\?\\+\\*\\?\\$\\.\\[\\]\\{\\}\\(\\)\\|\\/]+)['"]?`
  const regex: RegExp = new RegExp(pattern, 'gi')
  const transformed: string = value.replace(regex, `$1${options.text}`)
  log.debug('transformed', value, transformed)
  return transformed
}
