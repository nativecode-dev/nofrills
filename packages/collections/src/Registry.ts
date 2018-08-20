export type RegistryEntries<T> = Iterable<[string, T]> | ReadonlyArray<[string, T]>

export class Registry<T> {
  protected readonly map: Map<string, T>

  constructor(entries: RegistryEntries<T> = []) {
    this.map = new Map<string, T>(entries)
  }

  get keys(): IterableIterator<string> {
    return this.map.keys()
  }

  get values(): IterableIterator<T> {
    return this.map.values()
  }

  clear(): void {
    this.map.clear()
  }

  containsKey(key: string): boolean {
    return Array.from(this.map.keys()).indexOf(key) > -1
  }

  register(key: string, value: T): void {
    if (this.map.has(key) === false) {
      this.map.set(key, value)
    }
  }

  resolve(key: string): T | undefined {
    if (this.map.has(key)) {
      return this.map.get(key) as T
    }
    return undefined
  }

  unregister(key: string): void {
    if (this.map.has(key)) {
      this.map.delete(key)
    }
  }
}
