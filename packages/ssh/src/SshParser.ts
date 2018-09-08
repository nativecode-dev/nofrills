import { fs, FileResolver, RecursiveStrategy } from '@nofrills/fs'
import { generate, Parser, ParserBuildOptions } from 'pegjs'

export class SshParser {
  private readonly resolver: FileResolver

  constructor(cwd: string, private readonly grammar: string) {
    this.resolver = new FileResolver(cwd, [RecursiveStrategy])
  }

  async parser(): Promise<Parser> {
    const grammars = await this.resolver.find(this.grammar)

    if (grammars.length) {
      const options: ParserBuildOptions = {
        cache: true,
        optimize: 'speed',
      }

      const grammar = await fs.readFile(grammars[0])
      const parser = generate(grammar.toString(), options)
      return parser
    }

    throw new Error(`could not find grammar: ${this.grammar}`)
  }
}
