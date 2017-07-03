export class Registry<T> {
  protected readonly map: Map<string, T> = new Map<string, T>()

  public register(key: string, value: T): Registry<T> {
    if (this.map.has(key) === false) {
      this.map.set(key, value)
    }
    return this
  }

  public resolve(key: string): T | undefined {
    if (this.map.has(key)) {
      return this.map.get(key)
    }
  }
}
