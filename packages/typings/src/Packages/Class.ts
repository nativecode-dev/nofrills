import { CodeObject } from './CodeObject'
import { Methods } from './Method'
import { Properties } from './Property'

export interface Class extends CodeObject {
  methods: Methods
  properties: Properties
}

export interface Classes {
  [name: string]: Class
}
