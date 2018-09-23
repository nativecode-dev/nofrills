import { TaskEntry } from './TaskEntry'

export interface TaskJobResult {
  code: number
  errors: string[]
  job: TaskEntry
  messages: string[]
  signal: string | null
}
