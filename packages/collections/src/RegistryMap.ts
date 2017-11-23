export class RegistryMap<T> {
  protected readonly map: Map<string, T[]> = new Map<string, T[]>()

  public clear(): void {
    this.map.clear()
  }

  public register(key: string, value: T): void {
    if (this.map.has(key) === false) {
      this.map.set(key, [])
    }
    const collection = this.resolve(key)
    collection.push(value)
    this.map.set(key, collection)
  }

  public remove(key: string, value: T): void {
    if (this.map.has(key)) {
      const collection = this.resolve(key)
      const index: number = collection.indexOf(value)
      collection.splice(index, 1)
    }
  }

  public reset(key: string): void {
    if (this.map.has(key)) {
      this.map.set(key, [])
    }
  }

  public resolve(key: string): T[] {
    return this.map.get(key) || []
  }
}
