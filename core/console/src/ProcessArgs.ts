export interface ProcessArgsFilter {
  (argument: string, index: number): boolean
}

export class ProcessArgs {
  private readonly filtered: string[]

  protected constructor(args: string[], node: boolean) {
    this.filtered = this.filter(args, node)
  }

  static from(args: string[], node: boolean = true): ProcessArgs {
    return new ProcessArgs(args, node)
  }

  get args(): string[] {
    return this.filtered
  }

  get argsOnly(): string[] {
    return this.normalized.filter(arg => !arg.startsWith('-'))
  }

  get exe(): string {
    return this.filtered[0]
  }

  get normalized(): string[] {
    return this.filtered.slice(1)
  }

  get switches(): string[] {
    return this.normalized.filter(arg => arg.startsWith('-'))
  }

  has(...names: string[]): boolean {
    return names.some(name => this.hasOne(name))
  }

  hasOne(name: string): boolean {
    return this.switches.some(x => this.normalize(x) === this.normalize(name))
  }

  private filter(args: string[], node: boolean): string[] {
    return node ? args.slice(1) : args
  }

  private normalize(name: string): string {
    const argument = name.startsWith('--') ? name.substring(2) : name.startsWith('-') ? name.substring(1) : name
    return argument.trim().toLowerCase()
  }
}
