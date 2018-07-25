import 'mocha'

import { expect } from 'chai'

import { CouchbaseProvider } from '../src/CouchbaseProvider'

const TIMEOUT = 30000

describe('when importing couchbase documentation', () => {

  it('should get list of classes', async () => {

    const sut = new CouchbaseProvider()
    const pkg = await sut.import()
    expect(pkg.name).equals('2.1.4')

  }).timeout(TIMEOUT)

})
