import { CLI, ConsoleOptions, ProcessArgs } from '@nofrills/console'

import { SshParser } from './SshParser'

const options: ConsoleOptions = {
  initializer: async () => {
    const ssh = SshParser.from(process.cwd(), 'config.pegjs')
    const parser = await ssh.generate()
    parser.parse('')
    return Promise.resolve()
  },
}

CLI.run(options, ProcessArgs.from(process.argv)).catch(console.log)
