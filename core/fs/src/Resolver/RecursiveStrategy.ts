import { fs } from '../FileSystem'
import { FileResolverStrategy } from './FileResolver'

export const RecursiveStrategy: FileResolverStrategy = async (
  filename: string,
  cwd: string,
): Promise<string[] | null> => {
  let results: string[] = []

  const filepath = fs.join(cwd, filename)

  if (await fs.exists(filepath)) {
    return results.concat(filepath)
  }

  const parent = fs.resolve(cwd, '..')

  if (parent !== '/') {
    const found = await RecursiveStrategy(filename, parent)

    if (found) {
      return results.concat(...found)
    }
  }

  return null
}
