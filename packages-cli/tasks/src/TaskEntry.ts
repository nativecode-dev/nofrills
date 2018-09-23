import { TaskEntryType } from './TaskEntryType'

export interface TaskEntry {
  arguments?: string[]
  command: string
  detached?: boolean
  name?: string
  origin?: string
  type?: TaskEntryType
}
