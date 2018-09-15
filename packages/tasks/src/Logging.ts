export { Lincoln } from '@nofrills/lincoln-debug'

import chalk from 'chalk'
import { ScrubsInterceptor } from '@nofrills/scrubs'
import { CreateLogger, CreateOptions, Lincoln, Log, Options, LogMessageType } from '@nofrills/lincoln-debug'

const LoggerOptions: Options = CreateOptions('nofrills:tasks')
LoggerOptions.interceptors.register('scrubs', ScrubsInterceptor)
export const Logger: Lincoln = CreateLogger(LoggerOptions)

function colorize(log: Log): string[] {
  switch (log.type) {
    case LogMessageType.debug:
      return [
        chalk.dim.blue(log.namespace),
        chalk.bold.gray(...log.parameters.slice(0, 1)),
        chalk.dim.gray(...log.parameters.slice(1)),
      ]
    case LogMessageType.error:
    case LogMessageType.fatal:
      return [
        chalk.dim.blue(log.namespace),
        chalk.red(...log.parameters.slice(0, 1)),
        chalk.bgRed.white(...log.parameters.slice(1)),
      ]
    case LogMessageType.info:
      return [
        chalk.dim.blue(log.namespace),
        chalk.dim.yellow(...log.parameters.slice(0, 1)),
        chalk.dim.white(...log.parameters.slice(1)),
      ]
    case LogMessageType.trace:
      return [chalk.dim.blue(log.namespace), chalk.bold.gray(...log.parameters)]
    case LogMessageType.warn:
      return [chalk.dim.blue(log.namespace), chalk.bold.yellow(...log.parameters)]
    default:
      return [chalk.dim.blue(log.namespace), chalk.bold.white(...log.parameters)]
  }
}

const namespace = '[TASK]'
const ConsoleLogOptions: Options = CreateOptions(
  namespace,
  [['task-filter', (log: Log) => Promise.resolve(log.namespace === namespace)]],
  [['console-log', (log: Log) => Promise.resolve(console.log(...colorize(log))).then(() => log)]],
)
ConsoleLogOptions.emitTag = false
export const ConsoleLog: Lincoln = CreateLogger(ConsoleLogOptions)
