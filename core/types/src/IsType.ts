import { IsTypeHandler } from './IsTypeHandler'

export interface IsType {
  [name: string]: IsTypeHandler

  any: IsTypeHandler
  array: IsTypeHandler
  arrayOf: IsTypeHandler
  boolean: IsTypeHandler
  date: IsTypeHandler
  error: IsTypeHandler
  function: IsTypeHandler
  number: IsTypeHandler
  object: IsTypeHandler
  string: IsTypeHandler
}
