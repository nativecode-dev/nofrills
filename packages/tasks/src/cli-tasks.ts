import { CLI, ConsoleOptions, IConsole, ProcessArgs } from '@nofrills/console'

import { TaskBuilder } from './TaskBuilder'
import { Logger } from './Logging'

const options: ConsoleOptions = {
  initializer: async (_: IConsole, ...args: string[]) => {
    try {
      const builder = TaskBuilder.from(process.cwd())
      const results = await builder.run(args)

      Logger.debug(args, results)

      if (results.some(result => result.code !== 0)) {
        const filtered = results.map(result => ({
          code: result.code,
          job: result.job,
        }))

        console.log(...filtered)

        process.exit(5)
      }
    } catch (error) {
      console.log(error)
    }
  },
}

const args = ProcessArgs.from(process.argv)
CLI.run(options, args.exe, ...args.normalized).catch(console.log)
