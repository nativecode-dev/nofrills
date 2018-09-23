import { Task } from './Task'

export interface TaskJob {
  cwd: string
  name: string
  task: Task
}
