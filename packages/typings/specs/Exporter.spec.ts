import 'mocha'

import { FileSystem as fs } from '@nofrills/fs'

import { Package } from '../src/Packages'
import { Exporter } from '../src/Exporter'

describe('when using exporter', async () => {

  const typings = fs.join(process.cwd(), 'packages', 'typings')
  const templates = fs.join(typings, 'src', 'Templates')
  const filename = fs.join(typings, 'specs', 'couchbase.json')
  const output = fs.join(process.cwd(), '.artifacts')

  it.skip('should export package', async () => {
    const imported = await fs.json<Package>(filename)
    const exporter = new Exporter(templates)
    await exporter.export(imported, output)
  })

})
