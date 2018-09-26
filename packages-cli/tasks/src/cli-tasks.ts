import { fs } from '@nofrills/fs'
import { Returns } from '@nofrills/patterns'
import { DictionaryOf } from '@nofrills/types'
import { CLI, ConsoleOptions, ProcessArgs } from '@nofrills/console'

import { Task } from './Task'
import { TaskConfig } from './TaskConfig'
import { TaskBuilder } from './TaskBuilder'
import { ErrorCode } from './errors/ErrorCode'
import { Logger, ConsoleLog } from './Logging'
import { TaskEntryType } from './TaskEntryType'

const pargs = ProcessArgs.from(process.argv)

interface NPM {
  name: string
  version: string
}

async function execute(builder: TaskBuilder, config: TaskConfig) {
  const args = pargs.argsOnly
  ConsoleLog.info('[tasks]', ...args)

  const results = await builder.run(args, config)
  Logger.debug(results)

  const resultCodes: number[] = results
    .map(result => ({ code: result.code, errors: result.errors, messages: result.messages, job: result.entry }))
    .map(result =>
      Returns(result).after(() => (result.errors.length > 0 ? ConsoleLog.error(...result.errors) : void 0)),
    )
    .map(result =>
      Returns(result).after(
        () =>
          result.job.type === TaskEntryType.exec && result.messages.length > 0
            ? ConsoleLog.error(...result.errors)
            : void 0,
      ),
    )
    .map(result => result.code)

  const exitCode = Math.max(...resultCodes)
  Logger.debug(exitCode)
  return exitCode
}

const options: ConsoleOptions = {
  initializer: async () => {
    try {
      const npm = await fs.json<NPM>(fs.join(__dirname, '..', 'package.json'))
      ConsoleLog.silly(npm.name, `[${npm.version}]`, '\u00A9 2018 NativeCode')

      const builder = TaskBuilder.file(process.cwd())
      const config = await builder.build()
      Logger.debug(config.tasks)

      if (pargs.has('help') || pargs.has('h')) {
        console.log('-h, --help')
        console.log('-ls, --list')
        console.log('-v, -viz, --visualize')
      } else if (pargs.has('list') || pargs.has('ls')) {
        ConsoleLog.info('[list]')
        Object.keys(config.tasks)
          .sort()
          .map(name => ConsoleLog.trace(' :', name))
      } else if (pargs.has('visualize') || pargs.has('viz') || pargs.has('v')) {
        ConsoleLog.info('[visualize]')
        if (pargs.argsOnly.length > 0) {
          const collected = pargs.argsOnly.reduce<DictionaryOf<Task>>(
            (results, name) => Returns(results).after(() => (results[name] = config.tasks[name] as Task)),
            {},
          )
          console.log(JSON.stringify(collected, null, 2))
        } else {
          console.log(JSON.stringify(config, null, 2))
        }
      } else {
        process.exitCode = await execute(builder, config)
      }
    } catch (error) {
      ConsoleLog.error(error)
      console.log(error)
      process.exitCode = ErrorCode.UncaughtException
      ConsoleLog.error('☢', process.exitCode)
    }
  },
}

Logger.debug(process.argv)
CLI.run(options, pargs).catch(ConsoleLog.info)
