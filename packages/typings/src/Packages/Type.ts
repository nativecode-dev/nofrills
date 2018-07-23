export interface Type {
  name: string
  external: boolean
  reference?: any
  source?: string
}

export interface Types {
  [name: string]: Type
}
