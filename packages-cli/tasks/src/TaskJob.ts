import { Task } from './Task'

export interface TaskJob {
  cwd: string
  env: NodeJS.ProcessEnv
  name: string
  task: Task
}
