import { fs } from '@nofrills/fs'
import { render } from 'mustache'
import { Is, ObjectNavigator } from '@nofrills/types'

import { Package } from './Packages'
import { PackageError } from './Errors'

const Properties: string[] = ['constructors', 'enums', 'functions', 'methods', 'namespaces', 'properties', 'types']

export class Exporter {
  constructor(private readonly templates: string) {}

  async export(source: Package, outpath: string, separate: boolean = false): Promise<any> {
    const navigator = ObjectNavigator.from(source)
    navigator.recurse(this.onPropertyConverter)
    const context = navigator.toObject()

    if (separate) {
      await this.files(context, outpath)
    } else {
      await this.generate(context, outpath)
    }

    return context
  }

  protected files(context: any, outpath: string): Promise<void> {
    return Promise.reject(new PackageError(context, 'currently not supported'))
  }

  protected async generate(context: any, outpath: string): Promise<void> {
    const template = fs.join(this.templates, 'default.stache')

    if ((await fs.exists(template)) === false) {
      throw new Error(`missing template: ${template}`)
    }

    const text = await fs.text(template)
    const rendered = render(text, { package: context })
    const output = fs.join(outpath, `${context.name}.d.ts`)

    await fs.file(output, rendered)
  }

  private onPropertyConverter = (name: string, navigator: ObjectNavigator): void => {
    if (Properties.indexOf(name) >= 0 && Is.object(navigator.value)) {
      const value = Object.keys(navigator.value).map(key => navigator.value[key])
      navigator.set(name, value)
    }
  }
}
