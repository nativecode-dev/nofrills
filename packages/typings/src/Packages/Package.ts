import { CodeObject } from './CodeObject'
import { Namespace } from './Namespace'

export interface Package extends CodeObject {
  namespaces: Namespace[]
  version: string
}
