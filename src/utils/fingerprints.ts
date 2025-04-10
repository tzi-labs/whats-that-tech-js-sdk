import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import fs from 'fs/promises';

export async function loadFingerprints(debug = false): Promise<Record<string, any>> {
  // First check if we're in development mode (local core folder exists)
  const localCorePath = join(process.cwd(), 'core');
  const nodeModulesCorePath = join(process.cwd(), 'node_modules/whats-that-tech-core');
  const distCorePath = join(process.cwd(), 'dist/core.json');
  const rootCorePath = join(process.cwd(), 'core.json');
  
  if (debug) {
    console.log('Looking for fingerprints in:');
    console.log('- Local core:', localCorePath);
    console.log('- Node modules:', nodeModulesCorePath);
    console.log('- Dist core:', distCorePath);
    console.log('- Root core:', rootCorePath);
  }
  
  // In development, prefer local core folder, then node_modules
  if (existsSync(localCorePath) || existsSync(nodeModulesCorePath)) {
    const sourcePath = existsSync(localCorePath) ? localCorePath : nodeModulesCorePath;
    if (debug) {
      console.log('Loading fingerprints from:', sourcePath);
    }
    
    const techDirs = await readdir(sourcePath);
    const fingerprints: Record<string, any> = {};
    
    for (const tech of techDirs) {
      // Skip non-directory files and hidden directories
      const techPath = join(sourcePath, tech);
      const stat = await fs.stat(techPath);
      if (!stat.isDirectory() || tech.startsWith('.')) continue;
      
      try {
        // Look for JSON files in the tech directory
        const files = await readdir(techPath);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const fingerprintPath = join(techPath, file);
            const content = await readFile(fingerprintPath, 'utf-8');
            // Use the technology directory name as the key
            fingerprints[tech] = JSON.parse(content);
            if (debug) {
              console.log(`Loaded fingerprint for ${tech}`);
            }
          }
        }
      } catch (error) {
        if (debug) {
          console.error(`Failed to load fingerprint for ${tech}:`, error);
        }
        continue;
      }
    }
    
    if (debug) {
      console.log(`Loaded ${Object.keys(fingerprints).length} fingerprints from development mode`);
    }
    return fingerprints;
  }
  
  // Try to load from dist/core.json or root/core.json
  try {
    const corePath = existsSync(distCorePath) ? distCorePath : rootCorePath;
    if (existsSync(corePath)) {
      if (debug) {
        console.log('Loading fingerprints from:', corePath);
      }
      const content = await readFile(corePath, 'utf-8');
      const fingerprints = JSON.parse(content);
      if (debug) {
        console.log(`Loaded ${Object.keys(fingerprints).length} fingerprints from core.json`);
      }
      return fingerprints;
    }
  } catch (error) {
    if (debug) {
      console.error('Failed to load core.json:', error);
    }
  }
  
  if (debug) {
    console.error('No fingerprints could be loaded from any source');
  }
  return {};
} 