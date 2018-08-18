export class PropertyNotFound extends Error {
  constructor(name: string) {
    super(`could not find property: ${name}`)
  }
}
