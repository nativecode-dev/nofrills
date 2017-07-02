export class SmushError extends Error {
  private readonly error: Error

  constructor(error: Error, message?: string) {
    super(message || error.message)
    this.error = error
  }
}
