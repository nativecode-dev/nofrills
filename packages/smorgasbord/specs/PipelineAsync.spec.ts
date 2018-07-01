import 'mocha'

import { expect } from 'chai'
import { PipelineAsync, PipelineAsyncHandler } from '../src/PipelineAsync'

describe('when using pipeline handlers', () => {

  const brackets: PipelineAsyncHandler<string> = async (value: string): Promise<string> =>
    Promise.resolve(value.replace(/\{([a-z,_]+)\}/g, '$1'))

  it('should do transform string value', async () => {
    const sut = new PipelineAsync<string>()
    sut.add(brackets)
    const result = await sut.execute('{some_value}')
    expect(result).to.equal('some_value')
  })

})
