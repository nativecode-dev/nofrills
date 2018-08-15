import * as $fs from 'fs'
import * as $glob from 'glob'
import * as $path from 'path'
import * as $mkdirp from 'mkdirp'

import { URL } from 'url'

export const Constants = $fs.constants

export type PathLike = $fs.PathLike | string

export type Stats = $fs.Stats

export interface Descriptor {
  path: string
  stats: Stats
}

export class FileSystem {
  static readonly constants = $fs.constants

  static append(path: string | number | Buffer | URL, data: any, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      $fs.writeFile(path, data, error => {
        if (error && throws) {
          reject(error)
        }
        resolve(error ? false : true)
      })
    })
  }

  static basename(path: string, ext?: string | boolean): string {
    if (ext === false) {
      return $path.basename(path, $path.extname(path))
    }
    return $path.basename(path, ext === true ? undefined : ext)
  }

  static close(fd: number, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      $fs.close(fd, error => {
        if (error && throws) {
          reject(error)
        }
        resolve(error ? false : true)
      })
    })
  }

  static dirname(filepath: string): string {
    return $path.dirname(filepath)
  }

  static delete(path: PathLike, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      $fs.unlink(path, (error) => {
        if (error && throws) {
          reject(error)
        } else if (error) {
          resolve(false)
        }
        resolve(true)
      })
    })
  }

  static exists(path: PathLike, throws?: boolean, mode?: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      $fs.access(path, mode, error => {
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
    return $path.extname(filename)
  }

  static async file(path: string, content: string, throws?: boolean): Promise<boolean> {
    const dirname = this.dirname(path)
    if (await this.exists(dirname, throws) === false) {
      await this.mkdirp(dirname)
    }

    return new Promise<boolean>((resolve, reject) => {
      $fs.writeFile(path, content, error => {
        if (error && throws) {
          reject(false)
        }
        resolve(error ? false : true)
      })
    })
  }

  static glob(pattern: string, cwd?: string): Promise<string[]> {
    const patternstr = cwd ? this.join(cwd, pattern) : pattern
    return new Promise<string[]>((resolve, reject) => {
      $glob(patternstr, (error, matches) => {
        /** istanbul ignore next */
        if (error) {
          reject(error)
        }
        resolve(matches)
      })
    })
  }

  static list(path: PathLike): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      $fs.readdir(path, (error, files) => {
        /** istanbul ignore next */
        if (error) {
          reject(error)
        }
        resolve(files)
      })
    })
  }

  static info(path: PathLike): Promise<Descriptor> {
    return this.stat(path)
  }

  static join(...paths: string[]): string {
    return $path.join(...paths)
  }

  static async json<T>(path: string | number | Buffer | URL): Promise<T> {
    const text = await this.text(path)

    if (text) {
      return JSON.parse(text)
    }

    return Promise.reject(text)
  }

  static mkdir(path: PathLike, mode?: number | string, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      $fs.mkdir(path, mode, error => {
        if (error && throws) {
          reject(error)
        }
        resolve(error ? false : true)
      })
    })
  }

  static mkdirs(paths: string[], mode?: number | string, throws?: boolean): Promise<boolean> {
    return Promise.all(paths.map(path => this.mkdir(path, mode, throws)))
      .then(promises => promises.reduce((result, current) => result ? result : current, false))
  }

  static mkdirp(path: string, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      $mkdirp(path, error => {
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

  static open(path: PathLike, flags: string | number, mode?: string | number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $fs.open(path, flags, mode, (error, fd) => {
        if (error) {
          reject(error)
        }
        resolve(fd)
      })
    })
  }

  static read<T extends Buffer | Uint8Array>(fd: number, buffer: T, offset: number, length: number, position: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $fs.read(fd, buffer, offset, length, position, (error, data) => {
        if (error) {
          reject(error)
        }
        resolve(data)
      })
    })
  }

  static readFile(path: string | number | Buffer | URL): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      $fs.readFile(path, (error, buffer) => {
        if (error) {
          reject(error)
        }
        resolve(buffer)
      })
    })
  }

  static relative(from: string, to: string): string {
    return $path.relative(from, to)
  }

  static relativeFrom(to: string): string {
    return $path.relative(process.cwd(), to)
  }

  static rename(original: PathLike, filename: PathLike, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      $fs.rename(original, filename, error => {
        if (error && throws) {
          reject(error)
        }
        resolve(error ? false : true)
      })
    })
  }

  static resolve(...paths: string[]): string {
    return $path.resolve(...paths)
  }

  static async save<T>(path: string, object: T, throws?: boolean): Promise<boolean> {
    const dirname = this.dirname(path)
    if (await this.exists(dirname, throws) === false) {
      await this.mkdirp(dirname)
    }

    return new Promise<boolean>((resolve, reject) => {
      $fs.writeFile(path, JSON.stringify(object), error => {
        if (error && throws) {
          reject(false)
        }
        resolve(error ? false : true)
      })
    })
  }

  static stat(path: PathLike): Promise<Descriptor> {
    return new Promise<Descriptor>((resolve, reject) => {
      $fs.stat(path, (error, stats) => {
        if (error) {
          reject(error)
        }
        resolve({ path: String(path), stats })
      })
    })
  }

  static stats(...paths: PathLike[]): Promise<Descriptor[]> {
    return Promise.all(paths.map(path => this.stat(path)))
  }

  static text(path: string | number | Buffer | URL): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      $fs.readFile(path, (error, data) => {
        if (error) {
          reject(error)
        }

        if (data) {
          resolve(data.toString())
        }

        resolve(undefined)
      })
    })
  }

  static write<T extends Buffer | Uint8Array>(fd: number, buffer: T, offset?: number, length?: number, position?: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $fs.write<T>(fd, buffer, offset, length, position, (error, written) => {
        if (error) {
          reject(error)
        }
        resolve(written)
      })
    })
  }

  static writeFile(path: string | number | Buffer | URL, data: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $fs.writeFile(path, data, error => {
        if (error) {
          reject(error)
        }
        resolve()
      })
    })
  }
}

export const fs = FileSystem
