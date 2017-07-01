export class Registry<T> {
  private readonly map: Map<string, T> = new Map<string, T>()

  public register(key: string, value: T): Registry<T> {
    if (this.map.has(key) === false) {
      this.map.set(key, value)
    }
    return this
  }

  public resolve(key: string): T | undefined {
    return this.map.get(key)
  }
}
