import * as fs from 'fs'
import * as fsp from 'path'

export class Files {
  static exists(path: fs.PathLike): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      fs.access(path, error => {
        if (error) {
          resolve(false)
        }
        resolve(true)
      })
    })
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
}
