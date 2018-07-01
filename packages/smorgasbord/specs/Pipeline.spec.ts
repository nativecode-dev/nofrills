import 'mocha'

import { expect } from 'chai'
import { Pipeline, PipelineHandler } from '../src/Pipeline'

describe('when using pipeline handlers', () => {

  const brackets: PipelineHandler<string> = (value: string): string => value.replace(/\{([a-z,_]+)\}/g, '$1')

  it('should do transform string value', () => {
    const sut = new Pipeline<string>()
    sut.add(brackets)
    const result = sut.execute('{some_value}')
    expect(result).to.equal('some_value')
  })

})
