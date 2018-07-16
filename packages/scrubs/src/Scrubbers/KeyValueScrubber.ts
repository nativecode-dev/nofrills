import { Logger } from '../Logger'
import { ScrubsOptions } from '../Scrubs'

const log = Logger.extend('key-value-scrubber')

export async function KeyValueScrubber(value: string, options: ScrubsOptions): Promise<string> {
  const properties = options.properties.map(v => v.replace(/(-)/g, '\\-'))
  const keys = properties.join('|')
  const pattern = `((${keys})\\s*=)\\s*['"]?([\\d\\s\\w~!@#$%^,-<>:;\\?\\+\\*\\?\\$\\.\\[\\]\\{\\}\\(\\)\\|\\/]+)['"]?`
  const regex: RegExp = new RegExp(pattern, 'gi')
  const transformed: string = value.replace(regex, `$1${options.text}`)
  await log.debug('transformed', value, transformed)
  return transformed
}
