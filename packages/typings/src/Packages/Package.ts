import { Namespaces } from './Namespace'

export interface Package {
  name: string
  namespaces: Namespaces
  source?: string
}
