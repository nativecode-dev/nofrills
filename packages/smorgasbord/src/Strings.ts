import { Dictionary } from '@nofrills/collections'

import { Lincoln, Logger } from './Logging'

const logger: Lincoln = Logger.extend('strings')

export const Strings: Dictionary<any> = {
  format: (message: string, ...args: any[]): string => {
    logger.debug('format', message, args)

    return args.reduce((previous, current, index) => {
      const regex = new RegExp(`\\{${index}\\}`, 'gm')
      return previous.replace(regex, current)
    }, message)
  },

  formatObject: (message: string, object: Dictionary<string>): string => {
    const keys = Object.keys(object)
    logger.debug('formatObject', message, keys)

    return keys.reduce((previous, current, index) => {
      const regex = new RegExp(`\\{${current}\\}`, 'igm')
      return previous.replace(regex, object[current])
    }, message)
  },
}
