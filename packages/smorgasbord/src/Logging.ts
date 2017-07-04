export { Lincoln } from '@nofrills/lincoln'

import { Debug, Interceptor, Lincoln, Log, Options } from '@nofrills/lincoln'

const logger = console.log

const QuoteStrings: Interceptor = (log: Log) => {
  log.parameters = log.parameters.map((parameter: any) => {
    if (typeof parameter === 'string' && parameter[0] !== '"') {
      return `"${parameter}"`
    }
    return parameter
  })
  return log
}

const options: Partial<Options> = {
  interceptors: [QuoteStrings, Debug],
  namespace: 'nativecode:smorgasbord'
}

export const Logger: Lincoln = new Lincoln(options)
