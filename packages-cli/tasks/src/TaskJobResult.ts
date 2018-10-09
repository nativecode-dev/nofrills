import { TaskEntry } from './TaskEntry'

export interface TaskJobResult {
  code: number
  entry: TaskEntry
  errors: string[]
  messages: string[]
  signal: string | null
}

export function EmptyTaskJobResult(entry: TaskEntry): TaskJobResult {
  return {
    code: 0,
    entry,
    errors: [],
    messages: [],
    signal: null,
  }
}
