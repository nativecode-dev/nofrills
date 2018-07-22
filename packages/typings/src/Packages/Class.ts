import { Method } from './Method'
import { Property } from './Property'

export interface Class {
  name: string
  methods: Method[]
  properties: Property[]
}
