import { AsyncSubject } from 'rxjs'
import { FileSystem } from './FileSystem'

export class FileSystemEnumerator extends AsyncSubject<string> {
  async enumerate(root: string, recursive?: boolean) {
    const entries = await FileSystem.list(root)
    await Promise.all(entries
      .map(entry => FileSystem.join(root, entry))
      .map(async entry => {
        this.next(entry)
        const stats = await FileSystem.info(entry)
        if (recursive && stats.isDirectory()) {
          await this.enumerate(entry, recursive)
        }
      }))

    this.complete()
  }
}
