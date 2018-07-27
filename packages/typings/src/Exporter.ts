import { render } from 'mustache'
import { FileSystem as fs } from '@nofrills/fs'

import { Logger } from './Logger'
import { Package } from './Packages'
import { PackageError } from './Errors'

export class Exporter {
  private readonly log = Logger.extend('exporter')

  constructor(private readonly templates: string) { }

  export(source: Package, outpath: string, separate: boolean = false): Promise<void> {
    this.log.debug('templates', this.templates)
    this.log.debug('outpath', outpath)

    if (separate) {
      return this.files(source, outpath)
    }

    return this.generate(source, outpath)
  }

  protected files(source: Package, outpath: string): Promise<void> {
    return Promise.reject(new PackageError(source, 'currently not supported'))
  }

  protected async generate(source: Package, outpath: string): Promise<void> {
    const template = fs.join(this.templates, 'default.stache')

    if (await fs.exists(template) === false) {
      throw new Error(`missing template: ${template}`)
    }

    const text = await fs.text(template)
    const rendered = render(text, { package: source })

    const output = fs.join(outpath, `${source.name}.d.ts`)
    await fs.file(output, rendered)
    this.log.info('exported', output)
  }
}
