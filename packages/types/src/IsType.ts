import { IsTypeHandler } from './IsTypeHandler'

export interface IsType {
  [name: string]: IsTypeHandler
}
