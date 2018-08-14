export * from './Lerna'
export * from './Npm'
export * from './TypeScript'

import { NpmConfig } from './Npm'
import { ConfigHandlerRegistry } from '../ProjectConfig'

ConfigHandlerRegistry.register('package.json', NpmConfig)
