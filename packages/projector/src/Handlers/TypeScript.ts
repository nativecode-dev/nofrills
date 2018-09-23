import { fs } from '@nofrills/fs'
import { CompilerOptions } from 'typescript'
import { Lincoln } from '@nofrills/lincoln'

import { Logger } from '../Logger'
import { Project } from '../Project'
import { ProjectConfig } from '../ProjectConfig'
import { ObjectNavigator } from '@nofrills/types'

export interface TypeScript {
  compileOnSave?: boolean
  compilerOptions?: CompilerOptions
  exclude?: string[]
  extends?: string
  include?: string[]
}

export const TypeScriptFile = 'tsconfig.json'

const logger: Lincoln = Logger.extend('npm')

export async function TypeScriptConfig(project: Project, filepath: string): Promise<ProjectConfig | null> {
  const filename = fs.basename(filepath).toLowerCase()

  if (filename !== TypeScriptFile) {
    return null
  }

  if ((await fs.exists(filepath)) === false) {
    logger.warn('config', filepath)
    return null
  }

  const data = await fs.json<TypeScript>(filepath)
  const caps = ProjectConfig.caps(data)
  const config = new ProjectConfig(project, filepath, data, caps)
  const ts = config.as<TypeScript>()

  const navigator = ObjectNavigator.from(ts)
  const compilerOptions = navigator.getValue<CompilerOptions>('compilerOptions')

  if (compilerOptions) {
    logger.debug(compilerOptions.baseUrl)
  }

  return Promise.resolve(config)
}
