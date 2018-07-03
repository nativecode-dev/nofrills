import * as fs from 'fs'
import * as fsp from 'path'
import * as mkdirp from 'mkdirp'

import { URL } from 'url'

import { FileSystemEnumerator } from './FileSystemEnumerator'

export class FileSystem {
  static append(path: string | number | Buffer | URL, data: any, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      fs.writeFile(path, data, error => {
        if (error && throws) {
          reject(error)
        } else if (error) {
          resolve(false)
        }
        resolve(true)
      })
    })
  }

  static basename(path: string, ext?: string): string {
    return fsp.basename(path, ext)
  }

  static dirname(filepath: string): string {
    return fsp.dirname(filepath)
  }

  static delete(path: fs.PathLike, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      fs.unlink(path, (error) => {
        if (error && throws) {
          reject(error)
        } else if (error) {
          resolve(false)
        }
        resolve(true)
      })
    })
  }

  static enumerate(path: string, recursive?: boolean): Promise<void> {
    const enumerator = new FileSystemEnumerator()
    return enumerator.enumerate(path, recursive)
  }

  static exists(path: fs.PathLike, mode?: number, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      fs.access(path, mode, error => {
        if (error && throws) {
          reject(error)
        } else if (error) {
          resolve(false)
        }
        resolve(true)
      })
    })
  }

  static ext(filename: string): string {
    return fsp.extname(filename)
  }

  static list(path: fs.PathLike): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      fs.readdir(path, (error, files) => {
        if (error) {
          reject(error)
        }
        resolve(files)
      })
    })
  }

  static info(path: fs.PathLike): Promise<fs.Stats> {
    return new Promise<fs.Stats>((resolve, reject) => {
      fs.stat(path, (error, stats) => {
        if (error) {
          reject(error)
        }
        resolve(stats)
      })
    })
  }

  static join(...paths: string[]): string {
    return fsp.join(...paths)
  }

  static json<T>(path: string | number | Buffer | URL): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      fs.readFile(path, (error, data) => {
        if (error) {
          reject(error)
        }

        if (data) {
          const json = JSON.parse(data.toString())
          resolve(json)
        }

        resolve(undefined)
      })
    })
  }

  static mkdir(path: fs.PathLike, mode?: number | string, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      fs.mkdir(path, mode, error => {
        if (error && throws) {
          reject(error)
        } else if (error) {
          resolve(false)
        }
        resolve(true)
      })
    })
  }

  static mkdirs(paths: string[], mode?: number | string, throws?: boolean): Promise<boolean> {
    return Promise.all(paths.map(path => this.mkdir(path, mode, throws)))
      .then(promises => promises.reduce((result, current) => result ? result : current, false))
  }

  static mkdirp(path: string, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      mkdirp(path, error => {
        if (error && throws) {
          reject(error)
        } else {
          resolve(false)
        }
        resolve(true)
      })
    })
  }

  static mkdirps(paths: string[], throws?: boolean): Promise<boolean> {
    return Promise.all(paths.map(path => this.mkdirp(path, throws)))
      .then(promises => promises.reduce((result, current) => result ? result : current, false))
  }

  static read<T extends Buffer | Uint8Array>(fd: number, buffer: T, offset: number, length: number, position: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      fs.read(fd, buffer, offset, length, position, (error, data) => {
        if (error) {
          reject(error)
        }
        resolve(data)
      })
    })
  }

  static rename(original: fs.PathLike, filename: fs.PathLike, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      fs.rename(original, filename, error => {
        if (error && throws) {
          reject(error)
        } else if (error) {
          resolve(false)
        }
        resolve(true)
      })
    })
  }

  static save<T>(path: number | string | Buffer | URL, object: T, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(object), error => {
        if (error && throws) {
          reject(false)
        } else if (error) {
          resolve(false)
        }
        resolve(true)
      })
    })
  }

  static stat(path: fs.PathLike): Promise<fs.Stats> {
    return new Promise<fs.Stats>((resolve, reject) => {
      fs.stat(path, (error, stats) => {
        if (error) {
          reject(error)
        }
        resolve(stats)
      })
    })
  }

  static unext(filename: string): string {
    const extname = fsp.extname(filename)
    return filename.replace(extname, '')
  }

  static write<T extends Buffer | Uint8Array>(fd: number, buffer: T, offset?: number, length?: number, position?: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      fs.write<T>(fd, buffer, offset, length, position, (error, written) => {
        if (error) {
          reject(error)
        }
        resolve(written)
      })
    })
  }
}
