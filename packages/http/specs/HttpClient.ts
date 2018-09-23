import { HTTP } from '../src/Http'

export class HttpClient extends HTTP {
  constructor() {
    super('http-client')
  }

  protected get name(): string {
    return 'http-client'
  }

  protected request<TRequest>(body?: TRequest): Promise<RequestInit> {
    const req = {
      body: JSON.stringify(body),
      headers: {
        accept: 'application/json,text/json',
        'content-type': 'application/json',
      },
    }

    return Promise.resolve(req)
  }
}
