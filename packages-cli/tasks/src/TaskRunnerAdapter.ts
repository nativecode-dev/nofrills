import { Lincoln } from './Logging'
import { TaskJob } from './TaskJob'
import { TaskJobResult } from './TaskJobResult'

export type TaskRunnerAdapter = (
  task: TaskJob,
  log: Lincoln,
  out: NodeJS.WriteStream,
  err: NodeJS.WriteStream,
  ins: NodeJS.ReadStream,
) => Promise<TaskJobResult[]>
