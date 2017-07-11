import { Registry } from '@nofrills/collections'
import { Log } from './Log'

export type Filter = (log: Log) => boolean
export type Interceptor = (log: Log) => Log

export class LincolnRegistry<T extends Filter | Interceptor> extends Registry<T> { }
