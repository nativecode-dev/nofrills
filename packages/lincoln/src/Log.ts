export interface Log {
  readonly id: string
  readonly timestamp: number
  readonly namespace: string
  parameters: any[]
}
