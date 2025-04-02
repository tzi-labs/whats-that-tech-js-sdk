import { defineBuildConfig } from 'unbuild'

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
      // Copy core module to dist
      await execa('cp', ['-r', 'node_modules/whats-that-tech-core', 'dist/core'])
    }
  }
}) 