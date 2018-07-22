import { Logger } from './Logger'
import { Scrubs } from './Scrubs'

export const Registry: Scrubs = new Scrubs()

export const scrub = async (value: any): Promise<any> => {
  const result: any = await Registry.scrub<any>(value)
  Logger.debug('scrub', value, result)
  return result
}
