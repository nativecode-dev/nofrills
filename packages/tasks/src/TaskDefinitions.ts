import { Task } from './Task'

export type TaskDefinition = string | Task

export interface TaskDefinitions {
  [name: string]: Array<TaskDefinition>
}
