import 'mocha'

import { expect } from 'chai'
import { fs } from '@nofrills/fs'
import { Exporter } from '@nofrills/typings'

import { CouchbaseProvider } from '../src/CouchbaseProvider'

const TIMEOUT = 60000

describe('when importing couchbase documentation', () => {
  const artifacts = fs.join(process.cwd(), '.cache', '.artifacts')
  const output = fs.join(artifacts, 'couchbase')
  const templates = fs.join(process.cwd(), 'typings', 'typings', 'src', 'Templates')

  it.skip('should import all references', async () => {
    const provider = new CouchbaseProvider()
    const imported = await provider.import()
    await fs.save(fs.join(output, 'couchbase.json'), imported)

    const exporter = new Exporter(templates)
    const context = await exporter.export(imported, output)
    await fs.save(fs.join(output, 'context-couchbase.json'), context)

    expect(imported.name).equals('couchbase')
  }).timeout(TIMEOUT)
})
