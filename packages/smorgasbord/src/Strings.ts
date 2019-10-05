import { DictionaryOf } from '@nofrills/collections'

import Logger from './Logging'

const logger = Logger.extend('strings')

export const Strings: DictionaryOf<any> = {
  format: (message: string, ...args: any[]): string => {
    logger.debug('format', message, args)

    return args.reduce((previous, current, index) => {
      const regex = new RegExp(`\\{${index}\\}`, 'gm')
      return previous.replace(regex, current)
    }, message)
  },

  formatObject: (message: string, object: DictionaryOf<string>): string => {
    const keys = Object.keys(object)
    logger.debug('formatObject', message, keys)

    return keys.reduce((previous, current, index) => {
      const regex = new RegExp(`\\{${current}\\}`, 'igm')
      return previous.replace(regex, object[current])
    }, message)
  },
}
