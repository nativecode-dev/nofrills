import { Stream } from 'stream'

import { FileHandler } from '../FileHandler'

export class JsonFileHandler implements FileHandler {
  get supports(): string[] {
    return ['.json']
  }

  load(stream: Stream): Promise<Stream> {
    return Promise.resolve(stream)
  }

  save(stream: Stream): Promise<Stream> {
    return Promise.resolve(stream)
  }
}
