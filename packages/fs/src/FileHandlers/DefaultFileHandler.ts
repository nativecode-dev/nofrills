import { Stream } from 'stream'

import { FileHandler } from '../FileHandler'

export class DefaultFileHandler implements FileHandler {
  get supports(): string[] {
    return ['*']
  }

  load(stream: Stream): Promise<Stream> {
    return Promise.resolve(stream)
  }

  save(stream: Stream): Promise<Stream> {
    return Promise.resolve(stream)
  }
}
