import os from 'os'

import { promises as fs } from 'fs'

export class LogAppender {
  private handle: fs.FileHandle | null = null

  constructor(private readonly filename: string, private readonly filemode: number) {}

  async initialize() {
    this.handle = await fs.open(this.filename, this.filemode)
  }

  async append(value: string) {
    if (this.handle) {
      await fs.write(this.handle, Buffer.from(value))
      await fs.write(this.handle, Buffer.from(os.EOL))
    }
  }

  close() {}
}
