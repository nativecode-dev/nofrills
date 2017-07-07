import * as debug from 'debug'

import { Registry } from '@nofrills/collections'
import { Log } from './Log'
import { Filter, Interceptor } from './Types'

export const FilterRegistry: Registry<Filter> = new Registry<Filter>()
export const InterceptorRegistry: Registry<Interceptor> = new Registry<Interceptor>()

InterceptorRegistry.register('console', (log: Log): Log => {
  const logger = console.log
  logger(log.namespace, log.parameters)
  return log
})

InterceptorRegistry.register('debug', (log: Log): Log => {
  const logger: debug.IDebugger = debug(log.namespace)
  if (log.parameters.length && typeof log.parameters[0] === 'string') {
    const message: string = log.parameters[0]
    const args: any[] = log.parameters.slice(1)
    logger(message, ...args)
  } else {
    logger(log.parameters)
  }
  return log
})
