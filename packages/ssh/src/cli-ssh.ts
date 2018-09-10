import { CLI, ConsoleOptions } from '@nofrills/console'

import { SshParser } from './SshParser'

const options: ConsoleOptions = {
  initializer: async () => {
    const ssh = new SshParser(process.cwd(), 'config.pegjs')
    const parser = await ssh.generate()
    parser.parse('')
    return Promise.resolve()
  },
}

const exe = process.argv[0]
const args = process.argv.slice(1)
CLI.run(options, exe, ...args).catch(console.log)
