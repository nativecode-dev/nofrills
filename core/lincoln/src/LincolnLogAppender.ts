import path from 'path'

import { format } from 'util'

import { Lincoln } from './Lincoln'
import { Merge } from './Utilities/Merge'
import { LincolnLog } from './LincolnLog'
import { LincolnEnvelope } from './LincolnEnvelope'
import { LincolnLogAppenderOptions } from './LincolnLogAppenderOptions'
import { LogAppender } from './LogAppender'

const DefaultLincolnLogAppenderOptions: Partial<LincolnLogAppenderOptions> = {
  directory: process.cwd(),
  filemode: 0o660,
  logformat: 'default-log-%s.log',
  rotate: true,
}

export class LincolnLogAppender extends LincolnLog {
  private readonly options: LincolnLogAppenderOptions
  private readonly appender: LogAppender

  constructor(options: Partial<LincolnLogAppenderOptions>, lincoln: Lincoln) {
    super(lincoln)
    this.options = Merge<LincolnLogAppenderOptions>(DefaultLincolnLogAppenderOptions, options)
    this.appender = new LogAppender(this.logfile(), this.options.filemode)
  }

  protected initialize(): Promise<void> {
    return this.appender.initialize()
  }

  protected render(envelope: LincolnEnvelope): Promise<void> {
    return Promise.resolve()
  }

  protected renderError(envelope: LincolnEnvelope): Promise<void> {
    return Promise.resolve()
  }

  private logfile(): string {
    const filename = format(this.options.logformat, new Date().toISOString())
    return path.join(this.options.directory, filename)
  }
}
