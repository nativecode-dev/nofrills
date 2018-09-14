import { TaskEntry } from './TaskEntry'

export interface Task {
  entries: TaskEntry[]
  shell?: boolean | string
}
