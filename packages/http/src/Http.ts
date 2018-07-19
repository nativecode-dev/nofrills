import { Lincoln, Logger } from './Logger'

export abstract class HTTP {
  private readonly log: Lincoln

  constructor(name: string = 'http') {
    this.log = Logger.extend(name)
  }

  public async delete<TResponse>(url: string): Promise<TResponse> {
    return this.send<TResponse>(url, await this.request<void>(), 'DELETE')
  }

  public async get<TResponse>(url: string): Promise<TResponse> {
    return this.send<TResponse>(url, await this.request<void>(), 'GET')
  }

  public async head<TResponse>(url: string): Promise<TResponse> {
    return this.send<TResponse>(url, await this.request<void>(), 'HEAD')
  }

  public async patch<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    return this.send<TResponse>(url, await this.request<TRequest>(body), 'PATCH')
  }

  public async post<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    return this.send<TResponse>(url, await this.request<TRequest>(body), 'POST')
  }

  public async put<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    return this.send<TResponse>(url, await this.request<TRequest>(body), 'PUT')
  }

  protected abstract get name(): string
  protected abstract request<TRequest>(body?: TRequest): Promise<RequestInit>

  protected async send<T>(url: string, init?: RequestInit, method: string = 'GET'): Promise<T> {
    if (init && init.method === undefined) {
      init.method = method
    }

    await this.log.trace(`http.send:${method}:${url}`, JSON.stringify(init))

    const request = new Request(url, init)
    const response = await fetch(request, init)

    if (response.ok) {
      await this.log.trace(`http:${response.status}:[${response.statusText}]: ${url}`)
      try {
        return await response.json()
      } catch (error) {
        await this.log.error(`http.error:${response.status}`, response.statusText, error)
        throw error
      }
    }

    throw new Error(`[${response.status}]: ${response.statusText} - ${method} request failed at ${url}`)
  }
}
