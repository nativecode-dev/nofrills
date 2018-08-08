import { render } from 'mustache'
import { Is, ObjectNavigator } from '@nofrills/types'
import { FileSystem as fs } from '@nofrills/fs'

import { Logger } from './Logger'
import { Package } from './Packages'
import { PackageError } from './Errors'

const Properties: string[] = ['constructors', 'enums', 'functions', 'methods', 'namespaces', 'properties', 'types']

export class Exporter {
  private readonly log = Logger.extend('exporter')

  constructor(private readonly templates: string) { }

  async export(source: Package, outpath: string, separate: boolean = false): Promise<void> {
    this.log.debug('templates', this.templates)
    this.log.debug('outpath', outpath)

    const navigator = ObjectNavigator.from(source)
    const properties = navigator.recurse(this.onPropertyConverter)
    const transformed = navigator.toObject()
    await fs.save('D:\\properties.json', JSON.stringify(properties))

    return separate
      ? this.files(transformed, outpath)
      : this.generate(transformed, outpath)
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

  private onPropertyConverter = (name: string, navigator: ObjectNavigator): void => {
    if (Properties.indexOf(name.toLowerCase()) >= 0 && Is.object(navigator.value)) {
      const value = Object.keys(navigator.value).map(key => navigator.value[key])
      navigator.set(name, value)
    }
  }
}
