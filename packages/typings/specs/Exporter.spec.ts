import 'mocha'

import { fs } from '@nofrills/fs'

import { Exporter, Package } from '../src/index'

describe('when using exporter', async () => {
  const typings = fs.join(process.cwd(), 'typings', 'typings')
  const templates = fs.join(typings, 'src', 'Templates')
  const filename = fs.join(typings, 'specs', 'couchbase.json')
  const output = fs.join(process.cwd(), '.cache', '.artifacts', 'couchbase')

  xit('should export package', async () => {
    const imported = await fs.json<Package>(filename)
    const exporter = new Exporter(templates)
    const formatted = await exporter.export(imported, output)
    await fs.save(fs.join(output, 'context.json'), formatted)
  })
})
