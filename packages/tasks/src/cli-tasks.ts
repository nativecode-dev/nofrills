import { CLI, ConsoleOptions, IConsole, ProcessArgs } from '@nofrills/console'

import { TaskBuilder } from './TaskBuilder'
import { Logger, ConsoleLog } from './Logging'

const options: ConsoleOptions = {
  initializer: async (console: IConsole) => {
    try {
      ConsoleLog.trace(console.args.normalized)

      const builder = TaskBuilder.from(process.cwd())
      const config = await builder.build()
      Logger.debug(config.tasks)

      const results = await builder.run(console.args.normalized, config)
      Logger.debug(results)

      const exitCode = Math.max(
        ...results
          .map(result => ({ code: result.code, job: result.job }))
          .map(result => {
            ConsoleLog.error(`${result.job.command}: ${result.code}`)
            return result
          })
          .map(result => result.code),
      )

      process.exit(exitCode)
    } catch (error) {
      ConsoleLog.error(error)
    }
  },
}

CLI.run(options, ProcessArgs.from(process.argv)).catch(ConsoleLog.info)
