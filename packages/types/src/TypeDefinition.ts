export interface TypeDefinition {
  [key: string]: any
  default?: () => any
  max?: number
  min?: number
  nullable: boolean
  property?: string
  type: string
  typebase?: string
  validator?: (value: any) => boolean
}
