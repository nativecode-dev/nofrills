import { Dictionary } from '@nofrills/collections'

import { Lincoln, Logger } from './Logging'

const logger: Lincoln = Logger.extend('strings')

export const Strings: Dictionary<any> = {
  format: (message: string, ...args: any[]): string => {
    logger.debug('format', message, args)
    for (let index: number = 0; index < args.length; index++) {
      const regex = new RegExp('\\{' + index + '\\}', 'gm')
      message = message.replace(regex, args[index])
    }
    return message
  }
}
