export { Filter, Interceptor, Lincoln, LincolnRegistry, Log, Options } from '@nofrills/lincoln'
import { Filter, Interceptor, Lincoln, LincolnRegistry, Log, Options } from '@nofrills/lincoln'

export const ConsoleInterceptor: Interceptor = (log: Log): Promise<Log> => {
  const logger = console.log
  if (log.parameters.length && typeof log.parameters[0] === 'string') {
    logger(`${log.namespace} -> ${log.parameters[0]}`, log.parameters.slice(1))
  } else {
    logger(log.namespace, log.parameters)
  }
  return Promise.resolve(log)
}

export const CreateOptions = (namespace: string): Options => {
  const options: Options = {
    emitNamespace: true,
    emitTag: true,
    filters: new LincolnRegistry<Filter>(),
    interceptors: new LincolnRegistry<Interceptor>(),
    namespace,
    separator: ':',
  }

  options.interceptors.register('console-interceptor', ConsoleInterceptor)

  return options
}

export const CreateLogger = (options: string | Options | Partial<Options>): Lincoln => {
  if (typeof options === 'string') {
    return new Lincoln(CreateOptions(options))
  }
  return new Lincoln(options)
}
