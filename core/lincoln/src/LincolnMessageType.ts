export enum LincolnMessageType {
  info = 0,
  silly = 1 << 0,
  debug = 1 << 1,
  trace = 1 << 2,
  warn = 1 << 3,
  error = 1 << 4,
  fatal = 1 << 5,
}
