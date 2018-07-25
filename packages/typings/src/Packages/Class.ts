import { Type } from './Type'
import { Method } from './Method'
import { Property } from './Property'
import { CodeObject } from './CodeObject'
import { Constructor } from './Constructor'

export interface Class extends CodeObject {
  constructors: Constructor[]
  extends?: Type[]
  methods: Method[]
  properties: Property[]
}
