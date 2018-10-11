import { fs } from '@nofrills/fs'
import { Returns } from '@nofrills/patterns'
import { DictionaryOf } from '@nofrills/types'
import { CLI, ConsoleOptions, ProcessArgs } from '@nofrills/console'

import { Task } from './Task'
import { TaskConfig } from './TaskConfig'
import { TaskBuilder } from './TaskBuilder'
import { ErrorCode } from './errors/ErrorCode'
import { Logger, ConsoleLog } from './Logging'

const processed = ProcessArgs.from(process.argv)

interface NPM {
  name: string
  version: string
}

async function execute(builder: TaskBuilder, config: TaskConfig) {
  const args = processed.argsOnly
  const results = await builder.run(args, config)

  Logger.debug(results)

  const code: number = Math.max(
    ...results
      .map(result => ({ code: result.code, errors: result.errors, messages: result.messages, job: result.entry }))
      .map(result =>
        Returns(result).after(() => (result.errors.length > 0 ? ConsoleLog.error(...result.errors) : void 0)),
      )
      .map(result => result.code),
  )

  Logger.debug(code)

  return code
}

const options: ConsoleOptions = {
  initializer: async () => {
    try {
      const npm = await fs.json<NPM>(fs.join(__dirname, '..', 'package.json'))
      const builder = TaskBuilder.file(process.cwd())
      const config = await builder.build()
      Logger.debug(config.tasks)

      if (processed.has('help') || processed.has('h')) {
        ConsoleLog.silly(npm.name, `[${npm.version}]`, '\u00A9 2018 NativeCode')
        ConsoleLog.info('-h, --help')
        ConsoleLog.info('-ls, --list')
        ConsoleLog.info('-v, -viz, --visualize')
      } else if (processed.has('list') || processed.has('ls')) {
        ConsoleLog.info('[list]')
        Object.keys(config.tasks)
          .sort()
          .map(name => ConsoleLog.trace(' :', name))
      } else if (processed.has('visualize') || processed.has('viz') || processed.has('v')) {
        ConsoleLog.info('[visualize]')
        if (processed.argsOnly.length > 0) {
          const collected = processed.argsOnly.reduce<DictionaryOf<Task>>(
            (results, name) => Returns(results).after(() => (results[name] = config.tasks[name] as Task)),
            {},
          )
          ConsoleLog.info(JSON.stringify(collected, null, 2))
        } else {
          ConsoleLog.info(JSON.stringify(config, null, 2))
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

Logger.debug(...process.argv)
Logger.debug(...Object.keys(process.env).map(key => ({ name: key, value: process.env[key] })))
CLI.run(options, processed).catch(ConsoleLog.info)
