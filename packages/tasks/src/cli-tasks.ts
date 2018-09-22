import { Returns } from '@nofrills/patterns'
import { CLI, ConsoleOptions, ProcessArgs } from '@nofrills/console'

import { TaskBuilder } from './TaskBuilder'
import { Logger, ConsoleLog } from './Logging'

const args = ProcessArgs.from(process.argv)

const options: ConsoleOptions = {
  initializer: async () => {
    try {
      ConsoleLog.trace(args.normalized)

      const builder = TaskBuilder.from(process.cwd())
      const config = await builder.build()
      Logger.debug(config.tasks)

      const results = await builder.run(args.normalized, config)
      Logger.debug(results)

      const resultCodes: number[] = results
        .map(result => ({ code: result.code, errors: result.errors, job: result.job }))
        .map(result => Returns(result).after(() => ConsoleLog.info(`${result.job.command}: ${result.code}`)))
        .map(result => Returns(result).after(() => ConsoleLog.info(...result.errors)))
        .map(result => result.code)

      const exitCode = Math.max(...resultCodes)
      Logger.debug(exitCode)
      process.exit(exitCode)
    } catch (error) {
      ConsoleLog.error(error)
      process.exit(1)
    }
  },
}

CLI.run(options, args).catch(ConsoleLog.info)
