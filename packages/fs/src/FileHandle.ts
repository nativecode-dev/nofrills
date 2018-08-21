import * as fs from 'fs'
import { Is, Promisify } from '@nofrills/types'

export type File = FileDescriptor | FileName
export type FileDescriptor = number
export type FileName = string

export type BytesRead = number
export type BytesWritten = number

export class FileHandle {
  private handle: FileDescriptor = -1

  async close(): Promise<void> {
    await Promisify<void>(handler => fs.close(this.handle, handler))
    this.handle = -1
  }

  async open(file: FileDescriptor | FileName, flags: string | number, mode?: string | number | null): Promise<void> {
    if (this.handle !== -1) {
      await this.close()
    }

    this.handle = await this.filehandle(file, flags, mode)
  }

  read(buffer: Buffer | Uint8Array, offset: number = 0, length: number = 0, position: number | null = null): Promise<BytesRead> {
    return Promisify<BytesRead>(handler => fs.read(this.handle, buffer, offset, length, position, handler))
  }

  write(buffer: Buffer | Uint8Array, offset: number = 0): Promise<BytesWritten> {
    return Promisify<BytesWritten>(handler => fs.write(this.handle, buffer, offset, handler))
  }

  private filehandle(file: FileDescriptor | FileName, flags: string | number, mode?: string | number | null): Promise<FileDescriptor> {
    if (Is.string(file)) {
      const path = String(file)
      return Promisify<FileDescriptor>(handler => fs.open(path, flags, mode, handler))
    }

    return Promise.resolve(Number(file).valueOf())
  }
}
