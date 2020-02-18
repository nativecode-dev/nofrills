export interface FileResolverStrategy {
  (filename: string, cwd: string): Promise<string[] | null>
}

export class FileResolver {
  constructor(public readonly cwd: string, private readonly strategies: FileResolverStrategy[]) {}

  static from(cwd: string, strategies: FileResolverStrategy[]): FileResolver {
    return new FileResolver(cwd, strategies)
  }

  async find(filename: string): Promise<string[]> {
    const strats = await Promise.all(this.strategies.map(strategy => strategy(filename, this.cwd)))
    const filtered: string[][] = strats.filter(strat => strat !== null).map<string[]>(strat => strat as string[])
    const reduced = filtered.reduce<string[]>((result, value) => [...result, ...value], [])
    return reduced
  }
}
