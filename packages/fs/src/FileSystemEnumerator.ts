import { AsyncSubject } from 'rxjs'
import { fs } from './FileSystem'

export class FileSystemEnumerator extends AsyncSubject<string> {
  async enumerate(root: string, recursive?: boolean) {
    const entries = await fs.list(root)
    await Promise.all(entries
      .map(entry => fs.join(root, entry))
      .map(async entry => {
        this.next(entry)
        const stats = await fs.info(entry)
        if (recursive && stats.isDirectory()) {
          await this.enumerate(entry, recursive)
        }
      }))

    this.complete()
  }
}
