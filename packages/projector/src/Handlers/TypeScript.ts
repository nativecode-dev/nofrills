import { fs } from '@nofrills/fs'
import { CompilerOptions } from 'typescript'

import { Project } from '../Project'
import { ProjectConfig } from '../ProjectConfig'

export interface TypeScript {
  compileOnSave?: boolean
  compilerOptions?: CompilerOptions
  exclude?: string[]
  extends?: string
  include?: string[]
}

export const TypeScriptFile = 'tsconfig.json'

export async function TypeScriptConfig(project: Project, filepath: string): Promise<ProjectConfig | null> {
  const filename = fs.basename(filepath).toLowerCase()

  if (filename !== TypeScriptFile) {
    return null
  }

  if ((await fs.exists(filepath)) === false) {
    return null
  }

  const data = await fs.json<TypeScript>(filepath)
  const caps = ProjectConfig.caps(data)
  const config = new ProjectConfig(project, filepath, data, caps)
  return Promise.resolve(config)
}
