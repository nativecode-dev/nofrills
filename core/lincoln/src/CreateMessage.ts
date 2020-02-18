import { LincolnMessageOf } from './LincolnMessageOf'
import { LincolnMessageType } from './LincolnMessageType'

export function createMessage<T>(message: T, type: LincolnMessageType, attributes: any[] = []): LincolnMessageOf<T> {
  return { attributes, body: message, type }
}
