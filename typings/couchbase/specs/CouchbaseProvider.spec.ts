import 'mocha'

import { expect } from 'chai'
import { FileSystem as fs } from '@nofrills/fs'
import { Exporter } from '@nofrills/typings'

import { CouchbaseProvider } from '../src/CouchbaseProvider'

const TIMEOUT = 60000

describe('when importing couchbase documentation', () => {

  const artifacts = fs.join(process.cwd(), '.artifacts')
  const output = fs.join(process.cwd(), '.artifacts')
  const templates = fs.join(process.cwd(), 'packages', 'typings', 'src', 'Templates')

  it('should import all references', async () => {

    const sut = new CouchbaseProvider()
    const imported = await sut.import()
    expect(imported.name).equals('couchbase')

    await fs.save(fs.join(artifacts, 'couchbase.json'), imported)

    const exporter = new Exporter(templates)
    await exporter.export(imported, output)

  }).timeout(TIMEOUT)

})
