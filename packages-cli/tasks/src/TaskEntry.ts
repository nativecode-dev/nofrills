import { TaskEntryType } from './TaskEntryType'

export interface TaskEntry {
  arguments?: string[]
  command: string
  detached?: boolean
  gid?: number
  name?: string
  origin?: string
  type?: TaskEntryType
  uid?: number
}
