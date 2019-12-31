import Logger from '../Logger'

import { ScrubsOptions } from '../Scrubs'

const log = Logger.extend('url-scrubber')

export function UrlScrubber(value: string, options: ScrubsOptions): string {
  const regex: RegExp = /(https?:\/\/\w*:)\w+(@.*)/gi
  const transformed: string = value.replace(regex, `$1${options.text}$2`)
  log.debug('transformed', value, transformed)
  return transformed
}
