export class GrammarError extends Error {
  constructor(grammar: string) {
    super(grammar)
  }
}
