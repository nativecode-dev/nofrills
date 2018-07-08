import { ObjectNavigator } from './ObjectNavigator'

export interface ObjectPath {
  key: string
  navigator: ObjectNavigator
  path: string
  type: string
  value: any
}
