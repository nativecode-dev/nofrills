import { Lincoln, Logger } from '../Logger'

export interface FileResolverStrategy {
  (filename: string, cwd: string, logger: Lincoln): Promise<string[] | null>
}

export class FileResolver {
  private readonly log: Lincoln = Logger.extend('file-resolver')

  constructor(
    private readonly cwd: string,
    private readonly strategies: FileResolverStrategy[],
  ) {}

  async find(filename: string): Promise<string[]> {
    this.log.debug('find', filename)

    const strats = await Promise.all(
      this.strategies.map(strategy => strategy(filename, this.cwd, this.log)),
    )

    const filtered: string[][] = strats
      .filter(strat => strat !== null)
      .map<string[]>(strat => strat as string[])

    const reduced = filtered.reduce<string[]>(
      (result, value) => [...result, ...value],
      [],
    )

    this.log.debug('results', reduced)

    return reduced
  }
}
