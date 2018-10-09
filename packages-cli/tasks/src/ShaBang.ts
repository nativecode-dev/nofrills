import { fs } from '@nofrills/fs'
import { Is, Npm, DictionaryOf } from '@nofrills/types'

import { ConsoleLog, Lincoln, Logger } from './Logging'

export class ShaBang {
  private readonly log: Lincoln = Logger.extend('shabang')
  private readonly npm: Promise<Npm>

  protected constructor(npm: string) {
    this.log.debug('npm', npm)
    this.npm = fs.json<Npm>(npm)
  }

  static from(npm: string): ShaBang {
    return new ShaBang(npm)
  }

  async shabang(): Promise<void> {
    const npm = await this.npm

    if (Is.string(npm.bin)) {
      this.log.debug('bin', npm.bin)
      await ShaBang.shabangify(npm.bin as string)
    } else if (npm.bin) {
      const hash: DictionaryOf<string> = npm.bin as DictionaryOf<string>

      await Promise.all(
        Object.keys(hash).map(async key => {
          this.log.debug('bin', key)
          const bin = hash[key]

          try {
            return await ShaBang.shabangify(fs.join(process.cwd(), bin))
          } catch (error) {
            ConsoleLog.info(bin, error)
            return Promise.resolve()
          }
        }),
      )
    }
  }

  static async shabangify(filename: string): Promise<Buffer> {
    try {
      ConsoleLog.info('<cli-shabang>', filename)
      const shabang = Buffer.from('#!/usr/bin/env node\n')
      const original = await fs.readFile(filename)
      const combined = Buffer.concat([shabang, original])
      await fs.writeFile(filename, combined)
      return combined
    } catch (e) {
      ConsoleLog.error(`failed to write file: ${filename}`)
      throw e
    }
  }
}
