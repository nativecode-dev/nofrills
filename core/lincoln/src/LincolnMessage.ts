import { LincolnMessageType } from './LincolnMessageType'

export interface LincolnMessage {
  attributes: any[]
  body: any
  type: LincolnMessageType
}
