export interface IConsole {
  start(exe: string, ...args: string[]): Promise<void>
  stop(): void
}
