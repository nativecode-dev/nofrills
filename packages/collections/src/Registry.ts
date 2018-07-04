export class Registry<T> {
  protected readonly map: Map<string, T> = new Map<string, T>()

  public get keys(): IterableIterator<string> {
    return this.map.keys()
  }

  public get values(): IterableIterator<T> {
    return this.map.values()
  }

  public clear(): void {
    this.map.clear()
  }

  public containsKey(key: string): boolean {
    return Array.from(this.map.keys()).indexOf(key) > -1
  }

  public register(key: string, value: T): void {
    if (this.map.has(key) === false) {
      this.map.set(key, value)
    }
  }

  public resolve(key: string): T {
    if (this.map.has(key)) {
      return this.map.get(key) as T
    }
    throw new Error(`could not resolve: ${key}`)
  }

  public unregister(key: string): void {
    if (this.map.has(key)) {
      this.map.delete(key)
    }
  }
}
