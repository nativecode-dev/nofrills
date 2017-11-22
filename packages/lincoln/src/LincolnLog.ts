import { Dictionary } from '@nofrills/collections'

export interface LincolnLog {
  debug(...parameters: any[]): void
  error(...parameters: any[]): void
  fatal(...parameters: any[]): void
  info(...parameters: any[]): void
  trace(...parameters: any[]): void
  warn(...parameters: any[]): void
}
