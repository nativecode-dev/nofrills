import { fs } from '@nofrills/fs'
import { Lincoln } from '@nofrills/lincoln'
import { DictionaryOf } from '@nofrills/collections'

import { Logger } from '../Logger'
import { Project } from '../Project'
import { ProjectConfig } from '../ProjectConfig'

export interface NpmUrl {
  type?: string
  url?: string
}

export interface Npm {
  author?: string | string[] | DictionaryOf<string>
  bugs?: string | NpmUrl
  dependencies?: DictionaryOf<string>
  description?: string
  devDependencies?: DictionaryOf<string>
  homepage?: string
  license?: string
  main?: string
  name: string
  private?: boolean
  repository?: string | NpmUrl
  scripts?: DictionaryOf<string>
  types?: string,
  typeScriptVersion: string
  typings?: string
  version: string
  workspaces?: string[]
}

export const NpmFile = 'package.json'

const logger: Lincoln = Logger.extend('npm')

export async function NpmConfig(project: Project, filepath: string): Promise<ProjectConfig | null> {
  const filename = fs.basename(filepath).toLowerCase()

  if (filename !== NpmFile) {
    return null
  }

  if (await fs.exists(filepath) === false) {
    logger.warn('config', filepath)
    return null
  }

  const data = await fs.json<Npm>(filepath)
  const caps = ProjectConfig.getcaps(data)
  const config = new ProjectConfig(project, filepath, data, caps)

  const log = logger.extend(fs.basename(config.name, false))
  const hasWorkspaces = !!(data && data.workspaces)
  log.debug('workspaces', hasWorkspaces)

  if (hasWorkspaces) {
    const workspaces = data.workspaces || []
    const promises = workspaces.map(workspace => materialize(project, workspace, log))
    await Promise.all(promises)
  }

  return config
}

async function materialize(project: Project, workspace: string, log: Lincoln): Promise<void> {
  const pattern = fs.join(project.path, workspace)
  const packages = await fs.glob(pattern)

  log.debug('resolve', pattern, ...packages)

  const promises = packages.map(async path => {
    const projpath = fs.join(path, NpmFile)
    const child = await Project.load(projpath)
    project.add(child)
    log.debug('child', child.name, child.path)
  })

  await Promise.all(promises)
}
