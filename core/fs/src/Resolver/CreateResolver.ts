import { FileResolver, FileResolverStrategy } from './FileResolver'
import { RecursiveStrategy } from './RecursiveStrategy'

export function CreateResolver(
  cwd: string,
  strategies: FileResolverStrategy[] = [RecursiveStrategy],
): FileResolver {
  return new FileResolver(cwd, strategies)
}
