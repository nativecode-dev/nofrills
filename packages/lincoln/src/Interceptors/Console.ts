import { Interceptor, Log } from '../Lincoln'

export const Console: Interceptor = (log: Log): Log => {
  const logger = console.log
  logger(log.namespace, log.parameters)
  return log
}
