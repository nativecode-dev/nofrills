import { expect } from 'chai'

import * as mocha from 'mocha'
import { Type, Types } from '../src/index'

describe('when registering custom types', () => {
  it('should register with no typebase set', () => {
    const type: Partial<Type> = {
      type: 'custom'
    }
    Types.register(type)
    const typedef: Type = Types.resolve(type.type || 'any')
    expect(typedef.typebase).to.equal('object')
  })

  it('should register with no type set', () => {
    const type: Partial<Type> = {}
    Types.register(type)
    const typedef: Type = Types.resolve(type.type || 'any')
    expect(typedef.typebase).to.equal('object')
  })
})
