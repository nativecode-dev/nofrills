import { Types } from './Type'
import { Methods } from './Method'
import { Properties } from './Property'
import { CodeObject } from './CodeObject'
import { Constructor } from './Constructor'

export interface Class extends CodeObject {
  constructors: Constructor[]
  extends?: Types
  methods: Methods
  properties: Properties
}

export interface Classes {
  [key: string]: Class
}
