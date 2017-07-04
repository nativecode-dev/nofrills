import * as debug from 'debug'

import { Interceptor, Log } from '../'

export const Debug: Interceptor = (log: Log): Log => {
  const logger: debug.IDebugger = debug(log.namespace)
  if (log.parameters.length && typeof log.parameters[0] === 'string') {
    const message: string = log.parameters[0]
    const args: any[] = log.parameters.slice(1)
    logger(message, ...args)
  } else {
    logger(log.parameters)
  }
  return log
}
