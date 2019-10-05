export enum ProjectSupport {
  nyc,
  lerna,
  main,
  release,
  scripts,
  typings,
  workspaces,
  version,
}

export type ProjectSupportStrings = keyof typeof ProjectSupport
