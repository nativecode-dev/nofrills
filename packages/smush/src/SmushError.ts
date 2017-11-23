export class SmushError extends Error {
  public readonly error: Error

  constructor(error: Error, message?: string) {
    super(message || error.message)
    this.error = error
  }
}
