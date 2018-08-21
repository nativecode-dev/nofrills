import 'isomorphic-fetch'

import { Lincoln, Logger } from './Logger'

export enum HttpMethods {
  Delete = 'DELETE',
  Get = 'GET',
  Head = 'HEAD',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
}

export abstract class HTTP {
  protected readonly log: Lincoln

  constructor(name: string = 'http') {
    this.log = Logger.extend(name)
  }

  public async delete<TResponse>(url: string): Promise<TResponse> {
    const request = await this.request<void>()
    this.log.debug(HttpMethods.Delete, url, request)
    return this.send<TResponse>(url, request, HttpMethods.Delete)
  }

  public async get<TResponse>(url: string): Promise<TResponse> {
    const request = await this.request<void>()
    this.log.debug(HttpMethods.Get, url, request)
    return this.send<TResponse>(url, request, HttpMethods.Get)
  }

  public async head<TResponse>(url: string): Promise<TResponse> {
    const request = await this.request<void>()
    this.log.debug(HttpMethods.Head, url, request)
    return this.send<TResponse>(url, request, HttpMethods.Head)
  }

  public async patch<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    const request = await this.request<TRequest>(body)
    this.log.debug(HttpMethods.Patch, url, request)
    return this.send<TResponse>(url, request, HttpMethods.Patch)
  }

  public async post<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    const request = await this.request<TRequest>(body)
    this.log.debug(HttpMethods.Post, url, request)
    return this.send<TResponse>(url, request, HttpMethods.Post)
  }

  public async put<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    const request = await this.request<TRequest>(body)
    this.log.debug(HttpMethods.Put, url, request)
    return this.send<TResponse>(url, request, HttpMethods.Put)
  }

  protected abstract get name(): string
  protected abstract request<TRequest>(body?: TRequest): Promise<RequestInit>

  protected async send<T>(url: string, init?: RequestInit, method: string = 'GET'): Promise<T> {
    if (init && init.method === undefined) {
      init.method = method
    }

    this.log.trace(`http.send:${method}:${url}`, JSON.stringify(init))

    const request = new Request(url, init)
    const response = await fetch(request)

    if (response.ok) {
      this.log.trace(`http:${response.status}:[${response.statusText}]: ${url}`)

      try {
        return await response.json()
      } catch (error) {
        this.log.error(`http.error:${response.status}`, response.statusText, error)
        throw error
      }
    }

    throw new Error(`[${response.status}]: ${response.statusText} - ${method} request failed at ${url}`)
  }
}
