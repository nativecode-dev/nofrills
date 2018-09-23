import { TaskJobResult } from '../TaskJobResult'

export class TaskResultError extends Error {
  public readonly errors: string[]

  constructor(result: TaskJobResult) {
    super(result.signal ? `${result.code}: ${result.signal}` : `${result.code}`)
    this.errors = result.errors
  }
}
