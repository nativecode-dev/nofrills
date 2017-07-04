import { Log } from './Log'

export type Filter = (log: Log) => boolean
export type Interceptor = (log: Log) => Log
