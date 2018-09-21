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
        .map(result => ({ code: result.code, job: result.job }))
        .map(result => {
          ConsoleLog.error(`${result.job.command}: ${result.code}`)
          return result
        })
        .map(result => result.code)

      const exitCode = Math.max(...resultCodes)

      process.exit(exitCode)
    } catch (error) {
      ConsoleLog.error(error)
    }
  },
}

CLI.run(options, args).catch(ConsoleLog.info)
