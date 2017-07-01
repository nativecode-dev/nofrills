declare interface ZipCodesRegex {
  [key: string]: string
}

declare module 'zipcodes-regex' {
  const zipcodes: ZipCodesRegex
  export = zipcodes
}
