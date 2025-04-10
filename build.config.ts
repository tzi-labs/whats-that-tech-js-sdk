import { defineBuildConfig } from 'unbuild'
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { execa } from 'execa'

function findJsonFiles(dir: string): string[] {
  const files: string[] = []
  const items = readdirSync(dir)
  
  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)
    
    if (stat.isDirectory()) {
      files.push(...findJsonFiles(fullPath))
    } else if (item.endsWith('.json')) {
      files.push(fullPath)
    }
  }
  
  return files
}

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/cloudflare'
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true
  },
  hooks: {
    'build:done': async () => {
      const distPath = join(process.cwd(), 'dist')
      const localCorePath = join(process.cwd(), 'core')
      const nodeModulesCorePath = join(process.cwd(), 'node_modules/whats-that-tech-core')
      
      const combinedData: Record<string, any> = {}
      
      // Try to read from local core folder first
      const sourcePath = existsSync(localCorePath) ? localCorePath : nodeModulesCorePath
      
      // Find all JSON files recursively
      const jsonFiles = findJsonFiles(sourcePath)
      
      for (const filePath of jsonFiles) {
        try {
          const data = JSON.parse(readFileSync(filePath, 'utf-8'))
          // Get just the filename without extension as the key
          const key = filePath.split('/').pop()?.replace('.json', '') || ''
          combinedData[key] = data
        } catch (error) {
          console.error(`Error processing ${filePath}:`, error)
        }
      }
      
      // Write combined JSON file to both dist and root
      const outputPath = join(distPath, 'core.json')
      const jsonContent = JSON.stringify(combinedData, null, 2)
      
      writeFileSync(outputPath, jsonContent)
    }
  }
})