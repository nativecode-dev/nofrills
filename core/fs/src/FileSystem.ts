import $fs from 'fs'
import $glob from 'glob'
import $path from 'path'
import $mkdirp from 'mkdirp'

import { URL } from 'url'

export const Constants = $fs.constants

export type PathLike = $fs.PathLike | string

export interface Descriptor {
  path: string
  stats: $fs.Stats
}

export class FileSystem {
  constructor(private readonly fs: any) {}

  append(path: string | number | Buffer | URL, data: any, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.fs.writeFile(path, data, (error: Error) => {
        if (error && throws) {
          reject(error)
        } else {
          resolve(error ? false : true)
        }
      })
    })
  }

  basename(path: string, ext?: string | boolean): string {
    if (ext === false) {
      return $path.basename(path, $path.extname(path))
    }
    return $path.basename(path, ext === true ? undefined : ext)
  }

  chmod(path: PathLike, mode: number | string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $fs.chmod(path, mode, error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  close(fd: number, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.fs.close(fd, (error: Error) => {
        if (error && throws) {
          reject(error)
        } else {
          resolve(error ? false : true)
        }
      })
    })
  }

  delete(path: PathLike, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.fs.unlink(path, (error: Error) => {
        if (error && throws) {
          reject(error)
        } else if (error) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  }

  dirname(filepath: string): string {
    return $path.dirname(filepath)
  }

  exists(path: PathLike, throws?: boolean, mode?: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.fs.access(path, mode, (error: Error) => {
        if (error && throws) {
          reject(error)
        } else {
          resolve(error ? false : true)
        }
      })
    })
  }

  ext(filename: string): string {
    return $path.extname(filename)
  }

  async file(path: string, content: string, throws?: boolean): Promise<boolean> {
    const dirname = this.dirname(path)
    if ((await this.exists(dirname, throws)) === false) {
      await this.mkdirp(dirname)
    }

    return new Promise<boolean>((resolve, reject) => {
      this.fs.writeFile(path, content, (error: Error) => {
        if (error && throws) {
          reject(false)
        } else {
          resolve(error ? false : true)
        }
      })
    })
  }

  glob(pattern: string, cwd?: string): Promise<string[]> {
    const patternstr = cwd ? this.join(cwd, pattern) : pattern
    return new Promise<string[]>((resolve, reject) => {
      $glob(patternstr, (error, matches) => {
        if (error) {
          reject(error)
        } else {
          resolve(matches)
        }
      })
    })
  }

  async globs(patterns: string[], cwd?: string): Promise<string[]> {
    const resolved = await Promise.all(patterns.map(pattern => this.glob(pattern, cwd)))

    return resolved.reduce((results, current) => results.concat(current), [])
  }

  list(path: PathLike): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.fs.readdir(path, (error: Error, files: string[]) => {
        /** istanbul ignore next */
        if (error) {
          reject(error)
        } else {
          resolve(files)
        }
      })
    })
  }

  info(path: PathLike): Promise<Descriptor> {
    return this.stat(path)
  }

  join(...paths: string[]): string {
    return $path.join(...paths)
  }

  async json<T>(path: string | number | Buffer | URL): Promise<T> {
    const text = await this.text(path)

    if (text) {
      return JSON.parse(text)
    }

    return Promise.reject(text)
  }

  mkdir(path: PathLike, mode?: number | string, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.fs.mkdir(path, mode, (error: Error) => {
        if (error && throws) {
          reject(error)
        } else {
          resolve(error ? false : true)
        }
      })
    })
  }

  mkdirs(paths: string[], mode?: number | string, throws?: boolean): Promise<boolean> {
    return Promise.all(paths.map(path => this.mkdir(path, mode, throws))).then(promises =>
      promises.reduce((result, current) => (result ? result : current), false),
    )
  }

  mkdirp(path: string, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      $mkdirp(path, error => {
        if (error && throws) {
          reject(error)
        } else {
          resolve(error ? false : true)
        }
      })
    })
  }

  mkdirps(paths: string[], throws?: boolean): Promise<boolean> {
    return Promise.all(paths.map(path => this.mkdirp(path, throws))).then(promises =>
      promises.reduce((result, current) => (result ? result : current), false),
    )
  }

  open(path: PathLike, flags: string | number, mode?: string | number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.fs.open(path, flags, mode, (error: Error, fd: number) => {
        if (error) {
          reject(error)
        } else {
          resolve(fd)
        }
      })
    })
  }

  read<T extends Buffer | Uint8Array>(
    fd: number,
    buffer: T,
    offset: number,
    length: number,
    position: number,
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.fs.read(fd, buffer, offset, length, position, (error: Error, data: number) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  readFile(path: string | number | Buffer | URL): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      this.fs.readFile(path, (error: Error, buffer: Buffer) => {
        if (error) {
          reject(error)
        } else {
          resolve(buffer)
        }
      })
    })
  }

  relative(from: string, to: string): string {
    return $path.relative(from, to)
  }

  relativeFrom(to: string): string {
    return $path.relative(process.cwd(), to)
  }

  rename(original: PathLike, filename: PathLike, throws?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.fs.rename(original, filename, (error: Error) => {
        if (error && throws) {
          reject(error)
        } else {
          resolve(error ? false : true)
        }
      })
    })
  }

  resolve(...paths: string[]): string {
    return $path.resolve(...paths)
  }

  async save<T>(path: string, object: T, throws?: boolean): Promise<boolean> {
    const dirname = this.dirname(path)
    if ((await this.exists(dirname, throws)) === false) {
      await this.mkdirp(dirname)
    }

    return new Promise<boolean>((resolve, reject) => {
      this.fs.writeFile(path, JSON.stringify(object), (error: Error) => {
        if (error && throws) {
          reject(false)
        } else {
          resolve(error ? false : true)
        }
      })
    })
  }

  stat(path: PathLike): Promise<Descriptor> {
    return new Promise<Descriptor>((resolve, reject) => {
      this.fs.stat(path, (error: Error, stats: $fs.Stats) => {
        if (error) {
          reject(error)
        } else {
          resolve({ path: String(path), stats })
        }
      })
    })
  }

  stats(...paths: PathLike[]): Promise<Descriptor[]> {
    return Promise.all(paths.map(path => this.stat(path)))
  }

  text(path: string | number | Buffer | URL): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.fs.readFile(path, (error: Error, data: $fs.Stats) => {
        if (error) {
          reject(error)
        } else if (data) {
          resolve(data.toString())
        } else {
          resolve(undefined)
        }
      })
    })
  }

  write<T extends Buffer | Uint8Array>(
    fd: number,
    buffer: T,
    offset?: number,
    length?: number,
    position?: number,
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.fs.write(fd, buffer, offset, length, position, (error: Error, written: number) => {
        if (error) {
          reject(error)
        } else {
          resolve(written)
        }
      })
    })
  }

  writeFile(path: string | number | Buffer | URL, data: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.fs.writeFile(path, data, (error: Error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}

export const fs = new FileSystem($fs)
