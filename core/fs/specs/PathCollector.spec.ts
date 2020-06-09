import 'mocha'

import * as $fs from 'fs'

import expect from './expect'
import { PathCollector, fs } from '../src/index'

describe('when using PathCollector', () => {
  it('should collect paths from pattern', async () => {
    const pattern = 'core/*'
    const collector = PathCollector.from()
    const results = await collector.collect([pattern])

    const files = await new Promise<string[]>((resolve, reject) => {
      $fs.readdir(fs.join(process.cwd(), 'core'), (error, files) => {
        if (error) {
          reject(error)
        }
        resolve(files)
      })
    })

    expect(results.length).to.equal(files.length)
  })

  it('should collect paths from multiple patterns', async () => {
    const patterns = ['core/html/src', 'core/types/src']
    const collector = PathCollector.from(process.cwd())
    const results = await collector.collect(patterns, true)
    const listing = await fs.globs(patterns.map((pattern) => `${pattern}/**`))
    expect(results.length).to.equal(listing.length)
  })
})
