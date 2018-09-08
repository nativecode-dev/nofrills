import { CLI, ConsoleOptions } from '@nofrills/console'

import { SshParser } from './SshParser'

async function main(): Promise<void> {
  const ssh = new SshParser(process.cwd(), 'config.pegjs')
  const parser = await ssh.parser()
  parser.parse('')
  return Promise.resolve()
}

const options: ConsoleOptions = {
  initializer: main,
}

const cli = CLI.create(options, process.argv[0], ...process.argv.slice(1))
cli.start().catch(console.log)
