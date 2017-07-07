import * as debug from 'debug'

import { Registry } from '@nofrills/collections'
import { Filter, Interceptor, Lincoln, Log, Options } from '@nofrills/lincoln'

export const DebugInterceptor: Interceptor = (log: Log): Log => {
  const logger: debug.IDebugger = debug(log.namespace)
  if (log.parameters.length && typeof log.parameters[0] === 'string') {
    logger(log.parameters[0], log.parameters.slice(1))
  } else {
    logger(log.parameters)
  }
  return log
}

export const CreateOptions = (namespace: string): Options => {
  const options: Options = {
    filters: new Registry<Filter>(),
    interceptors: new Registry<Interceptor>(),
    namespace,
    separator: ':',
  }

  options.interceptors.register('debug', DebugInterceptor)

  return options
}

export const CreateLogger = (namespace: string): Lincoln => {
  return new Lincoln(CreateOptions(namespace))
}
