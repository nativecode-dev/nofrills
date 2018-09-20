import { Console } from './Console'
import { ProcessArgs } from './ProcessArgs'
import { ConsoleOptions } from './ConsoleOptions'

export class CLI<T extends ConsoleOptions> extends Console<T> {
  protected constructor(options: T, args: ProcessArgs) {
    super(options, args)
  }

  static create<T extends ConsoleOptions>(options: T, args?: ProcessArgs): Console<T> {
    return new CLI<T>(options, args || ProcessArgs.from(process.argv))
  }

  static run<T extends ConsoleOptions>(options: T, args: ProcessArgs): Promise<void> {
    return CLI.create<T>(options, args).start()
  }
}
