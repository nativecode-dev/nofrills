import { Task } from './Task'
import { TaskEntry } from './TaskEntry'

export type TaskDefinition = string | TaskEntry

export interface TaskDefinitions {
  [name: string]: TaskDefinition[] | Task
}
