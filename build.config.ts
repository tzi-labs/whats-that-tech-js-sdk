import { defineBuildConfig } from 'unbuild'
import { existsSync } from 'fs'
import { join } from 'path'

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true
  },
  hooks: {
    'build:done': async () => {
      const { execa } = await import('execa')
      // Use whats-that-tech-core from node_modules during build
      await execa('cp', ['-r', 'node_modules/whats-that-tech-core', 'dist/core'])
    }
  }
}) 