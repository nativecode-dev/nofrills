import { CreateResolver } from '@nofrills/fs'
import { CLI, ConsoleOptions, IConsole, ProcessArgs } from '@nofrills/console'

import { ShaBang } from './ShaBang'
import { Logger } from './Logging'

const options: ConsoleOptions = {
  initializer: async (_: IConsole) => {
    try {
      const cwd = process.cwd()
      const resolver = CreateResolver(cwd)
      const resolved = await resolver.find('package.json')

      Logger.debug('shabang', cwd)

      if (resolved.length > 0) {
        console.log(`using ${resolved[0]}`)
        const shabang = new ShaBang(resolved[0])
        await shabang.shabang()
        return
      }

      throw new Error('could not find package.json')
    } catch (error) {
      console.log(error)
    }
  },
}

const args = ProcessArgs.from(process.argv)
CLI.run(options, args.exe, ...args.normalized).catch(console.log)
