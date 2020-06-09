import { Command, CommandResult } from './Command'

export interface CommandExec {
  (command: Command): Promise<CommandResult>
}

export class CommandGroup {
  protected constructor(private readonly commands: Command[]) {}

  static from(...commands: Command[]): CommandGroup {
    return new CommandGroup(commands)
  }

  parallel(exec: CommandExec = (cmd) => cmd.exec()): Promise<CommandResult[]> {
    return Promise.all(this.commands.map((command) => exec(command)))
  }

  serial(exec: CommandExec = (cmd) => cmd.exec()): Promise<CommandResult[]> {
    return this.commands.reduce(async (previous: Promise<CommandResult[]>, command: Command) => {
      const results = await previous
      const result = await exec(command)
      return results.concat(result)
    }, Promise.resolve<CommandResult[]>([]))
  }
}
