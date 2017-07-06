export class Registry<T> {
  protected readonly map: Map<string, T | undefined> = new Map<string, T | undefined>()

  public get keys(): IterableIterator<string> {
    return this.map.keys()
  }

  public get values(): IterableIterator<T | undefined> {
    return this.map.values()
  }

  public clear(): void {
    this.map.clear()
  }

  public register(key: string, value: T): void {
    if (this.map.has(key) === false) {
      this.map.set(key, value)
    }
  }

  public resolve(key: string): T | undefined {
    if (this.map.has(key)) {
      return this.map.get(key)
    }
  }

  public unregister(key: string, value: T): void {
    if (this.map.has(key)) {
      this.map.set(key, undefined)
    }
  }
}
