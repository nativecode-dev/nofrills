import { LincolnLog } from './LincolnLog'

export class LincolnLogs implements LincolnLog {
  private readonly loggers: LincolnLog[]

  constructor(loggers: LincolnLog[]) {
    this.loggers = loggers
  }

  public debug(...parameters: any[]): void {
    this.loggers.forEach(logger => logger.debug(...parameters))
  }

  public error(...parameters: any[]): void {
    this.loggers.forEach(logger => logger.error(...parameters))
  }

  public fatal(...parameters: any[]): void {
    this.loggers.forEach(logger => logger.fatal(...parameters))
  }

  public info(...parameters: any[]): void {
    this.loggers.forEach(logger => logger.info(...parameters))
  }

  public silly(...parameters: any[]): void {
    this.loggers.forEach(logger => logger.silly(...parameters))
  }

  public trace(...parameters: any[]): void {
    this.loggers.forEach(logger => logger.trace(...parameters))
  }

  public warn(...parameters: any[]): void {
    this.loggers.forEach(logger => logger.warn(...parameters))
  }
}
