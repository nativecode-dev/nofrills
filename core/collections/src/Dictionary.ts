/**
 * Interface is deprecated in favor if the DictionaryOf type.
 * In a future version this interface will be the equivalent
 * of DictionaryOf<string>, which is the correct transitional
 * type to use.
 * @deprecated since version 3.1.12
 */
export interface Dictionary<T> {
  [key: string]: T
}

export interface DictionaryOf<T> {
  [key: string]: T
}
