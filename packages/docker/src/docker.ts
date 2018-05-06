import * as yargs from 'yargs'

export const args = yargs.usage('$0 [options] <command>')
  .options({
    't': {
      alias: 'tag',
      describe: 'image tag',
      type: 'string',
    }
  })
  .command(
    'build [context]',
    'build the container image',
    a => a.options({
      't': {
        alias: 'test'
      }
    }))
  .help()
  .argv
