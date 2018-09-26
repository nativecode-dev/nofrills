import { TaskJob } from './TaskJob'
import { TaskJobResult } from './TaskJobResult'

export interface TaskRunnerAdapter {
  readonly stdin: NodeJS.ReadStream
  readonly stdout: NodeJS.WriteStream
  readonly stderr: NodeJS.WriteStream
  execute(job: TaskJob): Promise<TaskJobResult[]>
}
