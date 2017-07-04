export const Dates: any = {
  today: (): string => new Date().toDateString(),
  tomorrow: (): string => {
    const now = new Date()
    return (new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)).toDateString()
  },
}
