import { LincolnLog } from './LincolnLog'
import { LincolnEnvelope } from './LincolnEnvelope'

export class LincolnLogConsole extends LincolnLog {
  protected initialize(): Promise<void> {
    return Promise.resolve()
  }

  protected async render(envelope: LincolnEnvelope): Promise<void> {
    console.log(envelope.created, envelope.message.body, envelope.message.attributes)
  }

  protected async renderError(envelope: LincolnEnvelope): Promise<void> {
    console.error(envelope.created, envelope.message.body)
  }
}
