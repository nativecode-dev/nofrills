import 'mocha'

import { expect } from 'chai'
import { PathCollector } from '../src/index'

describe('when using PathCollector', () => {
  const cwd = process.cwd()

  it('should collect single pattern', async () => {
    const pattern = 'packages/*'
    const collector = new PathCollector(cwd)
    const results = await collector.collect([pattern])
    expect(results.length).to.equal(12)
  })

  it('should collect single pattern recursively', async () => {
    const patterns = ['packages/fs/specs', 'packages/fs/src']
    const collector = new PathCollector(cwd)
    const results = await collector.collect(patterns, true)
    expect(results.length).to.equal(8)
  })

})
