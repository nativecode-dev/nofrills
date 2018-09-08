import { Lincoln } from '../Logger'

import { fs } from '../FileSystem'
import { FileResolverStrategy } from './FileResolver'

export const RecursiveStrategy: FileResolverStrategy = async (
  filename: string,
  cwd: string,
  logger: Lincoln,
): Promise<string[] | null> => {
  const log = logger.extend('recursive')

  let results: string[] = []

  const filepath = fs.join(cwd, filename)

  if (await fs.exists(filepath)) {
    log.debug('found', filepath)
    return results.concat(filepath)
  }

  const parent = fs.resolve(cwd, '..')

  if (parent !== '/') {
    const found = await RecursiveStrategy(filename, parent, logger)
    if (found) {
      log.debug('found', ...found)
      return results.concat(...found)
    }
  }

  return null
}
