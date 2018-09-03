import 'mocha'

import { expect } from 'chai'
import { PathCollector, fs } from '../src/index'

describe('when using PathCollector', () => {
  it('should collect paths from pattern', async () => {
    const pattern = 'packages/*'
    const collector = PathCollector.from()
    const results = await collector.collect([pattern])
    expect(results.length).to.equal(17)
  })

  it('should collect paths from multiple patterns', async () => {
    const patterns = ['packages/html/src', 'packages/types/src']
    const collector = PathCollector.from(process.cwd())
    const results = await collector.collect(patterns, true)
    const listing = await fs.globs(patterns.map(pattern => `${pattern}/**`))
    expect(results.length).to.equal(listing.length)
  })

})
