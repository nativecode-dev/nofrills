import { CLI, ConsoleOptions, IConsole, ProcessArgs } from '@nofrills/console'

import { TaskBuilder } from './TaskBuilder'
import { Logger, ConsoleLog } from './Logging'

const options: ConsoleOptions = {
  initializer: async (_: IConsole, ...args: string[]) => {
    try {
      ConsoleLog.trace(args)

      const builder = TaskBuilder.from(process.cwd())
      const results = await builder.run(args)

      Logger.debug(args, results)

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

const args = ProcessArgs.from(process.argv)
CLI.run(options, args.exe, ...args.normalized).catch(ConsoleLog.info)
