import { Registry, RegistryEntries } from '@nofrills/collections'
import { Log } from './Log'

export type Filter = (log: Log) => Promise<boolean>
export type Interceptor = (log: Log) => Promise<Log>

export class LincolnRegistry<T extends Filter | Interceptor> extends Registry<T> {
  constructor(entries: RegistryEntries<T> = []) {
    super(entries)
  }
}
