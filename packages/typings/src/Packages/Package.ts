import { Namespace } from './Namespace'

export interface Package {
  name: string
  namespaces: Namespace[]
  source?: string
}
