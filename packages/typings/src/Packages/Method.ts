export interface Method {
  name: string
  source?: string
}

export interface Methods {
  [name: string]: Method
}
