import { RegistryEntries } from './Registry'

export class RegistryMap<T> {
  protected readonly map: Map<string, T[]>

  constructor(entries: RegistryEntries<T[]> = []) {
    this.map = new Map<string, T[]>(entries)
  }

  get keys(): string[] {
    return Array.from(this.map.keys())
  }

  clear(): void {
    this.map.clear()
  }

  register(key: string, value: T): void {
    if (this.map.has(key) === false) {
      this.map.set(key, [])
    }
    const collection = this.resolve(key)
    collection.push(value)
    this.map.set(key, collection)
  }

  remove(key: string, value: T): void {
    if (this.map.has(key)) {
      const collection = this.resolve(key)
      const index: number = collection.indexOf(value)
      collection.splice(index, 1)
    }
  }

  reset(key: string): void {
    if (this.map.has(key)) {
      this.map.set(key, [])
    }
  }

  resolve(key: string): T[] {
    return this.map.get(key) || []
  }
}
