import { readdir, readFile } from 'fs/promises';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, statSync } from 'fs';
import fsPromises from 'fs/promises';

// Calculate __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function loadFingerprints(debug = false, customDir?: string): Promise<Record<string, any>> {
  // Define potential paths for fingerprints
  const localCorePath = resolve(__dirname, '../../core'); // Used in local dev
  const nodeModulesCorePath = resolve(__dirname, '../../node_modules/whats-that-tech-core/core'); // Used when core is a dev dependency
  const distCorePath = resolve(__dirname, '../../dist/core.json'); // Corrected: Used when consumed as a package
  // const rootCorePath = resolve(__dirname, '../../core.json'); // Removed: Assume build places it in dist
  
  // 1. Try custom directory if provided
  if (customDir && existsSync(customDir)) {
    if (debug) {
      console.log(`Attempting to load fingerprints from custom directory: ${customDir}`);
    }
    try {
      const sourcePath = customDir;
      const techDirs = await readdir(sourcePath);
      const fingerprints: Record<string, any> = {};
      
      for (const tech of techDirs) {
        // Skip non-directory files and hidden directories
        const techPath = join(sourcePath, tech);
        // Use statSync for quick check before async operations
        if (!statSync(techPath).isDirectory() || tech.startsWith('.')) continue; 
        
        try {
          const files = await readdir(techPath);
          for (const file of files) {
            if (file.endsWith('.json')) {
              const fingerprintPath = join(techPath, file);
              const content = await readFile(fingerprintPath, 'utf-8');
              fingerprints[tech] = JSON.parse(content);
              if (debug) {
                console.log(`Loaded custom fingerprint for ${tech}`);
              }
            }
          }
        } catch (error) {
          if (debug) {
            console.error(`Failed to load fingerprint for ${tech} from custom directory:`, error);
          }
          // Decide if we should continue or potentially fail harder for custom dirs? For now, continue.
        }
      }
      
      if (Object.keys(fingerprints).length > 0) {
        if (debug) {
           console.log(`Loaded ${Object.keys(fingerprints).length} fingerprints from custom directory: ${customDir}`);
        }
        return fingerprints;
      } else {
         if (debug) {
           console.warn(`Custom directory specified (${customDir}), but no fingerprints were loaded from it.`);
         }
         // Fall through to default logic if custom dir is empty or fails
      }
    } catch (error) {
       if (debug) {
          console.error(`Error accessing custom directory ${customDir}:`, error);
       }
       // Fall through to default logic if custom dir access fails
    }
  } else if (customDir && !existsSync(customDir)) {
      if (debug) {
          console.warn(`Custom directory specified (${customDir}), but it does not exist. Falling back to default paths.`);
      }
  }
  
  // 2. Try development paths if customDir wasn't used or failed
  // In development, prefer local core folder, then node_modules
  if (existsSync(localCorePath) || existsSync(nodeModulesCorePath)) {
    const sourcePath = existsSync(localCorePath) ? localCorePath : nodeModulesCorePath;
    if (debug) {
      console.log('Loading fingerprints from development path:', sourcePath);
    }
    
    const techDirs = await fsPromises.readdir(sourcePath);
    const fingerprints: Record<string, any> = {};
    
    for (const tech of techDirs) {
      // Skip non-directory files and hidden directories
      const techPath = join(sourcePath, tech);
      const stat = await fsPromises.stat(techPath);
      if (!stat.isDirectory() || tech.startsWith('.')) continue;
      
      try {
        // Look for JSON files in the tech directory
        const files = await fsPromises.readdir(techPath);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const fingerprintPath = join(techPath, file);
            const content = await fsPromises.readFile(fingerprintPath, 'utf-8');
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
  
  // 3. Try distribution/production paths if dev paths don't exist
  // Try to load from dist/core.json 
  try {
    if (existsSync(distCorePath)) {
      const corePath = distCorePath;
      if (debug) {
        console.log('Loading fingerprints from distribution/fallback path:', corePath);
      }
      const content = await fsPromises.readFile(corePath, 'utf-8');
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