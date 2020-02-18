import { LincolnMessage } from './LincolnMessage'

export interface LincolnMessageOf<T> extends LincolnMessage {
  body: T
}
