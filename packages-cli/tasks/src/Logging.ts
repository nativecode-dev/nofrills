export { Lincoln } from '@nofrills/lincoln-debug'

import chalk from 'chalk'
import { ScrubsInterceptor } from '@nofrills/scrubs'
import { CreateLogger, CreateOptions, Lincoln, Log, Options } from '@nofrills/lincoln-debug'

const LoggerOptions: Options = CreateOptions('nofrills:tasks')
LoggerOptions.interceptors.register('scrubs', ScrubsInterceptor)
export const Logger: Lincoln = CreateLogger(LoggerOptions)

function colorize(log: Log): string[] {
  switch (log.type) {
    case 'debug':
      return [
        chalk.dim.cyan(log.namespace),
        chalk.dim.yellow('🠶'),
        chalk.bold.gray(...log.parameters.slice(0, 1)),
        chalk.dim.gray(...log.parameters.slice(1)),
      ]
    case 'error':
      return [
        chalk.dim.cyan(log.namespace),
        chalk.bold.red('🛇'),
        chalk.red(...log.parameters.slice(0, 1)),
        chalk.bgRed.white(...log.parameters.slice(1)),
      ]
    case 'fatal':
      return [
        chalk.dim.cyan(log.namespace),
        chalk.bold.red('🚭'),
        chalk.red(...log.parameters.slice(0, 1)),
        chalk.bgRed.white(...log.parameters.slice(1)),
      ]
    case 'info':
      return [
        chalk.dim.cyan(log.namespace),
        chalk.bold.blue('🛈'),
        chalk.dim.green(...log.parameters.slice(0, 1)),
        chalk.dim.white(...log.parameters.slice(1)),
      ]
    case 'silly':
      return [
        chalk.dim.cyan(log.namespace),
        chalk.bold.blue('🆃'),
        chalk.dim.blue(...log.parameters.slice(0, 1)),
        chalk.dim.white(...log.parameters.slice(1)),
      ]
    case 'trace':
      return [chalk.dim.cyan(log.namespace), chalk.bold.gray('🞲'), chalk.bold.gray(...log.parameters)]
    case 'warn':
      return [chalk.dim.cyan(log.namespace), chalk.bold.yellow('🛆'), chalk.bold.yellow(...log.parameters)]
    default:
      return [chalk.dim.cyan(log.namespace), chalk.bold.blue('🛈'), chalk.bold.white(...log.parameters)]
  }
}

const namespace = ''
const ConsoleLogOptions: Options = CreateOptions(
  namespace,
  [['task-filter', (log: Log) => Promise.resolve(log.namespace === namespace)]],
  [
    [
      'console-log',
      (log: Log) => {
        console.log(...colorize(log))
        return Promise.resolve(log)
      },
    ],
  ],
)
ConsoleLogOptions.emitTag = false
export const ConsoleLog: Lincoln = CreateLogger(ConsoleLogOptions)
