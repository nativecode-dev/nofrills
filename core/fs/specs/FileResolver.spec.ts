import 'mocha'

import expect from './expect'
import { RecursiveStrategy } from '../src/Resolver/RecursiveStrategy'

import { FileResolver, FileResolverStrategy } from '../src/Resolver/FileResolver'

describe('when working with Files', () => {
  const strategies: FileResolverStrategy[] = [RecursiveStrategy]

  it('should find files', async () => {
    const resolver = new FileResolver(process.cwd(), strategies)
    const results = await resolver.find('package.json')
    expect(results).to.be.lengthOf(1)
  })

  it('should not find files', async () => {
    const resolver = new FileResolver(process.cwd(), strategies)
    const results = await resolver.find('nonexistant.json')
    expect(results).to.be.lengthOf(0)
  })
})
