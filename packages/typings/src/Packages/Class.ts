import { CodeObject } from './CodeObject'
import { Constructors } from './Constructor'
import { Methods } from './Method'
import { Properties } from './Property'

export interface Class extends CodeObject {
  constructors: Constructors
  methods: Methods
  properties: Properties
}

export interface Classes {
  [name: string]: Class
}
