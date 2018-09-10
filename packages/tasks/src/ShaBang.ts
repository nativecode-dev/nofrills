import { URL } from 'url'
import { fs } from '@nofrills/fs'
import { Is, Npm, DictionaryOf } from '@nofrills/types'

import { Lincoln, Logger } from './Logging'

export class ShaBang {
  private readonly log: Lincoln = Logger.extend('shabang')
  private readonly npm: Promise<Npm>

  constructor(npm: string) {
    this.log.debug('npm', npm)
    this.npm = fs.json<Npm>(npm)
  }

  async shabang(): Promise<void> {
    const npm = await this.npm

    if (Is.string(npm.bin)) {
      this.log.debug('bin', npm.bin)
      await ShaBang.shabangify(npm.bin as string, true)
    } else if (npm.bin) {
      const hash: DictionaryOf<string> = npm.bin as DictionaryOf<string>

      await Promise.all(
        Object.keys(hash).map(async key => {
          this.log.debug('bin', key)
          const bin = hash[key]
          try {
            return await ShaBang.shabangify(bin)
          } catch (error) {
            console.log(bin, error)
            return Promise.resolve()
          }
        }),
      )
    }
  }

  static async shabangify(
    buffer: string | Buffer | URL,
    overwrite: boolean = true,
  ): Promise<Buffer> {
    const shabang = Buffer.from('#!/usr/bin/env node\n')

    const file = Is.string(buffer)
      ? await fs.readFile(buffer)
      : (buffer as Buffer)

    const transformed = Buffer.concat([shabang, file])

    if (overwrite && Is.string(buffer)) {
      await fs.writeFile(buffer, transformed)
    }

    if (Is.string(buffer)) {
      try {
        await fs.chmod(buffer, 755)
      } catch {
        console.log(`failed to set executable flag: ${buffer}`)
      }
    }

    return transformed
  }
}
