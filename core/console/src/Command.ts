import { ChildProcess, ExecOptions, SpawnOptions, exec, spawn } from 'child_process'

export interface CommandOptions {
  args: string[]
  cwd?: string
  exe: string
  shell?: string
}

export interface CommandResult {
  args: string[]
  code: number
  exe: string
  messages: string
  reason?: string
}

const DefaultOptions: Partial<CommandOptions> = {
  args: [],
  cwd: process.cwd(),
}

export class Command {
  private readonly options: CommandOptions

  protected constructor(options: Partial<CommandOptions>) {
    this.options = Object.assign({}, DefaultOptions, options) as CommandOptions
  }

  static from(options: Partial<CommandOptions>): Command {
    return new Command(options)
  }

  exec(collectResult: boolean = true): Promise<CommandResult> {
    return new Promise((resolve, reject) => {
      const options: ExecOptions = {
        cwd: this.options.cwd,
        shell: this.options.shell || undefined,
      }

      const command = this.createCommand()

      const child = exec(command, options, (error, stdout, stderr) => {
        if (error && collectResult === false) {
          reject(error)
        } else {
          resolve({ args: this.options.args, code: 0, exe: this.options.exe, messages: stdout, reason: stderr })
        }
      })

      child.on('uncaughtException', (error: Error) => {
        if (collectResult === false) {
          reject(error)
        }
      })
    })
  }

  spawn(): Promise<ChildProcess> {
    const options: SpawnOptions = {
      cwd: this.options.cwd,
      shell: this.options.shell,
    }

    const child = spawn(this.options.exe, this.options.args, options)
    return Promise.resolve(child)
  }

  private createCommand(): string {
    return [this.options.exe, ...this.options.args].join(' ')
  }
}
