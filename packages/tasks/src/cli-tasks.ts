import { CLI, ConsoleOptions, IConsole } from '@nofrills/console'

import { TaskBuilder } from './TaskBuilder'
import { Logger } from './Logging'

const options: ConsoleOptions = {
  initializer: async (_: IConsole, ...args: string[]) => {
    try {
      const builder = TaskBuilder.from(process.cwd())
      const results = await builder.run(args)
      Logger.debug(args, results)
    } catch (error) {
      console.log(error)
    }
  },
}

const exe = process.argv[1]
const args = process.argv.slice(2)
CLI.run(options, exe, ...args).catch(console.log)
