import { CreateResolver } from '@nofrills/fs'
import { CLI, ConsoleOptions, ProcessArgs } from '@nofrills/console'

import { ShaBang } from './ShaBang'
import { ConsoleLog, Logger } from './Logging'

const args = ProcessArgs.from(process.argv)

const options: ConsoleOptions = {
  initializer: async () => {
    try {
      const cwd = process.cwd()
      const resolver = CreateResolver(cwd)
      const resolved = await resolver.find('package.json')

      Logger.debug('shabang', cwd)

      if (resolved.length > 0) {
        const filename = resolved[0]
        ConsoleLog.trace('package-json', filename)

        const shabang = ShaBang.from(filename)
        await shabang.shabang()
        return
      }

      throw new Error('could not find package.json')
    } catch (error) {
      ConsoleLog.error(error)
    }
  },
}

CLI.run(options, args).catch(ConsoleLog.info)
