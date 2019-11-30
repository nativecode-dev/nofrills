export type ElementCallback = (element: HTMLElement) => HTMLElement
export type ElementsCallback = (elements: HTMLElement[]) => HTMLElement[]

export interface Dictionary<T> {
  [key: string]: T
}

export type ValueCallback<T> = (value: T) => T
export type ValueProvider<T> = () => T
export type VoidCallback<T> = (value: T) => void

export const $also = <T>(value: T, ...callbacks: VoidCallback<T>[]): T =>
  callbacks.reduce((result, callback) => {
    // TODO: Need to fix because we mutate here.
    callback(result)
    return result
  }, value)

export class Html {
  private readonly cache: Dictionary<HTMLElement[]>

  constructor(cache: Dictionary<HTMLElement[]>) {
    this.cache = cache
  }

  public attribute(id: string | HTMLElement, name: string, value?: string): string {
    const element = this.convert(id)
    if (value) {
      element.setAttribute(name, value)
      return value
    }
    return element.getAttribute(name) || ''
  }

  public click(id: string | HTMLButtonElement, callback?: ElementCallback): HTMLButtonElement {
    return $also(
      this.convert(id),
      x => x.click(),
      x => (callback ? callback(x) : void 0),
    )
  }

  public element<T extends HTMLElement>(id: string, selector?: string, callback?: ElementCallback): T {
    const key = `${id}::${selector}`
    if (this.cache[key]) {
      return (callback ? callback(this.cache[key][0]) : this.cache[key][0]) as T
    }

    const created = document.getElementById(id) as T
    const selected = (this.cache[key] = [(selector ? created.querySelector<T>(selector) : created) as T])
    return (callback ? callback(selected[0]) || selected[0] : selected[0]) as T
  }

  public elements<T extends HTMLElement>(id: string | T, selector: string, callback?: ElementsCallback): T[] {
    if (typeof id === 'string') {
      const key = `${id}::${selector}`
      if (this.cache[key]) {
        return (callback ? callback(this.cache[key]) : this.cache[key]) as T[]
      }

      const collection = Array.from(this.element(id).querySelectorAll<T>(selector))
      return (callback ? callback(collection) || collection : collection) as T[]
    }

    return Array.from(id.querySelectorAll(selector))
  }

  public enabled(id: string): boolean {
    return this.element(id).hasAttribute('disabled')
  }

  public options(id: string, selector?: string): HTMLOptionElement[] {
    return this.elements(id, selector ? selector : 'option') as HTMLOptionElement[]
  }

  public select(id: string | HTMLSelectElement, value: string): HTMLOptionElement {
    const options = Array.from(this.convert(id).querySelectorAll('option'))
    return options.reduce((previous, current) =>
      current.value === value
        ? $also(current, x => x.setAttribute('selected', ''))
        : $also(previous, x => x.removeAttribute('selected')),
    )
  }

  public selected(id: string, selector?: string): HTMLOptionElement {
    return this.options(id, selector).reduce((previous, current) =>
      current.hasAttribute('selected') ? current : previous,
    )
  }

  public visible(id: string): boolean {
    return this.element(id).style.display !== 'none' || this.element(id).style.visibility !== 'hidden'
  }

  private convert<T extends HTMLElement>(id: string | T): T {
    return typeof id === 'string' ? this.element(id) : id
  }
}

const cache: any = {}
export const HTML: Html = new Html(cache)
