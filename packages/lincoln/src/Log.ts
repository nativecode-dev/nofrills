export interface Log {
  readonly id: string
  readonly tag: string
  readonly timestamp: number
  namespace: string
  parameters: any[]
}
