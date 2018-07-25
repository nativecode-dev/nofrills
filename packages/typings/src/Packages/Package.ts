import { CodeObject } from './CodeObject'
import { Namespaces } from './Namespace'

export interface Package extends CodeObject {
  namespaces: Namespaces
}
