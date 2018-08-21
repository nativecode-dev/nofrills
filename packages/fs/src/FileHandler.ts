import { Stream } from 'stream'

export interface FileHandler {
  supports: string[]

  load(stream: Stream): Promise<Stream>
  save(stream: Stream): Promise<Stream>
}
