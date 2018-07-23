import { Methods } from './Method'
import { Properties } from './Property'

export interface Class {
  name: string
  methods: Methods
  properties: Properties
  source?: string
}

export interface Classes {
  [name: string]: Class
}
