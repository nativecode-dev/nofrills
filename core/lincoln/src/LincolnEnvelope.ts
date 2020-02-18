import { LincolnMessage } from './LincolnMessage'

export interface LincolnEnvelope {
  created: Date
  message: LincolnMessage
  scope: string
}
