import { Logger } from './Logger'
import { Scrubs } from './Scrubs'

export const Registry: Scrubs = new Scrubs()

export const scrub = (value: any): any => {
  const result: any = Registry.scrub<any>(value)
  Logger.debug('scrub', value, result)
  return result
}
