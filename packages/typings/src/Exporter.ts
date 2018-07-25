import { render } from 'mustache'
import { FileSystem as fs } from '@nofrills/fs'

import { Package } from './Packages'
import { PackageError } from './Errors'

export class Exporter {
  constructor(private readonly templates: string) { }

  export(source: Package, separate: boolean = false): Promise<void> {
    if (separate) {
      return this.generateFiles(source)
    }

    return this.generateFile(source)
  }

  protected async generateFile(source: Package): Promise<void> {
    const template = fs.join(this.templates, 'default.ttsd')

    if (await fs.exists(template) === false) {
      throw new Error(`missing template: ${template}`)
    }

    const text = await fs.text(template)

    const rendered = render(text, source)
    await fs.file(`${source.name}.d.ts`, rendered)
  }

  protected generateFiles(source: Package): Promise<void> {
    return Promise.reject(new PackageError(source, 'currently not supported'))
  }
}
