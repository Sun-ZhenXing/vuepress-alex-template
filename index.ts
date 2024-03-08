import { getDirname, path } from 'vuepress/dist/utils'
import type { UserConfig } from 'vuepress'
export { defineUserConfig } from 'vuepress'
import { defu } from 'defu'
import { slug as slugify } from 'github-slugger'
import { viteBundler } from '@vuepress/bundler-vite'
import { ThemeOptions } from 'vuepress-theme-hope'

export type TemplatePathOptions = {
  root_path: string
  current_path: string
}

export function getPathOptions(dirname: string): TemplatePathOptions {
  const dir = getDirname(dirname)
  return {
    root_path: path.resolve(dir, '../..'),
    current_path: path.resolve(dir, '.'),
  }
}

export function userConfigMarkdown(path: TemplatePathOptions, options?: UserConfig['markdown']): UserConfig['markdown'] {
  return defu({
    anchor: {
      level: [1, 2, 3, 4, 5, 6],
      slugify,
    },
    importCode: {
      handleImportPath: (str: string) => str
        .replace(/^\//, path.root_path.replace(/(?:|\\|\/)$/, '/'))
        .replace(/^@\//, path.current_path.replace(/(?:|\\|\/)$/, '/')),
    },
  }, options)
}

export function userConfig(path: TemplatePathOptions, options?: UserConfig): UserConfig {
  return defu({
    alias: {
      '@': path.current_path,
    },
    bundler: viteBundler({
      viteOptions: {
        optimizeDeps: {
          include: [
            // BUG: https://github.com/mermaid-js/mermaid/issues/4320
            'mermaid',
          ],
        },
      },
    }),
    markdown: userConfigMarkdown(path),
  }, options)
}

export type requiredUserConfigKey = keyof Pick<UserConfig, 'base' | 'lang' | 'title'>
export type requiredUserConfig = Pick<UserConfig, requiredUserConfigKey>
export type requiredHopeThemeKey = keyof Pick<ThemeOptions, 'author' | 'docsDir' | 'footer' | 'metaLocales' | 'repo'>
export type requiredHopeTheme = Pick<ThemeOptions, requiredHopeThemeKey>
