import { Parameters } from './Parameter'

export interface Constructor {
  parameters: Parameters
  public: boolean
}

export interface Constructors {
  [index: number]: Constructor
}
