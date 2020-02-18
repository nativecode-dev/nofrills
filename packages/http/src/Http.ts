import 'isomorphic-fetch'

export enum HttpMethods {
  Delete = 'DELETE',
  Get = 'GET',
  Head = 'HEAD',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
}

export abstract class HTTP {
  constructor(readonly name: string = 'http') {}

  public async delete<TResponse>(url: string): Promise<TResponse> {
    const request = await this.request<void>()
    return this.send<TResponse>(url, request, HttpMethods.Delete)
  }

  public async get<TResponse>(url: string): Promise<TResponse> {
    const request = await this.request<void>()
    return this.send<TResponse>(url, request, HttpMethods.Get)
  }

  public async head<TResponse>(url: string): Promise<TResponse> {
    const request = await this.request<void>()
    return this.send<TResponse>(url, request, HttpMethods.Head)
  }

  public async patch<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    const request = await this.request<TRequest>(body)
    return this.send<TResponse>(url, request, HttpMethods.Patch)
  }

  public async post<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    const request = await this.request<TRequest>(body)
    return this.send<TResponse>(url, request, HttpMethods.Post)
  }

  public async put<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    const request = await this.request<TRequest>(body)
    return this.send<TResponse>(url, request, HttpMethods.Put)
  }

  protected abstract request<TRequest>(body?: TRequest): Promise<RequestInit>

  protected async send<T>(url: string, init?: RequestInit, method: string = 'GET'): Promise<T> {
    if (init && init.method === undefined) {
      init.method = method
    }

    const request = new Request(url, init)
    const response = await fetch(request)

    if (response.ok) {
      try {
        return await response.json()
      } catch (error) {
        throw error
      }
    }

    throw new Error(`[${response.status}]: ${response.statusText} - ${method} request failed at ${url}`)
  }
}
