import { Returns } from '@nofrills/patterns'
import { CLI, ConsoleOptions, ProcessArgs } from '@nofrills/console'

import { TaskBuilder } from './TaskBuilder'
import { ErrorCode } from './errors/ErrorCode'
import { Logger, ConsoleLog } from './Logging'

const pargs = ProcessArgs.from(process.argv)

const options: ConsoleOptions = {
  initializer: async () => {
    try {
      const args = pargs.argsOnly
      ConsoleLog.trace('args:', ...args)

      const builder = TaskBuilder.from(process.cwd())
      const config = await builder.build()
      Logger.debug(config.tasks)

      const results = await builder.run(args, config)
      Logger.debug(results)

      const resultCodes: number[] = results
        .map(result => ({ code: result.code, errors: result.errors, messages: result.messages, job: result.job }))
        .map(result => Returns(result).after(() => ConsoleLog.info(`${result.job.command}: ${result.code}`)))
        .map(result => Returns(result).after(() => ConsoleLog.error(...result.errors)))
        .map(result => Returns(result).after(() => ConsoleLog.info(...result.messages)))
        .map(result => result.code)

      const exitCode = Math.max(...resultCodes)
      Logger.debug(exitCode)
      ConsoleLog.trace('exit-code:', exitCode)
      process.exitCode = exitCode
    } catch (error) {
      ConsoleLog.error(error)
      console.log(error)
      process.exitCode = ErrorCode.UncaughtException
    }
  },
}

Logger.debug(process.argv)

CLI.run(options, pargs).catch(ConsoleLog.info)
