import { readdir, readFile } from 'fs/promises';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, statSync } from 'fs';
import fsPromises from 'fs/promises';
import fetch from 'node-fetch'; // Need fetch for URLs

// Calculate __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to check if a string is a URL
function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

export async function loadFingerprints(debug = false, customDir?: string, customFile?: string): Promise<Record<string, any>> {
  // Define potential paths for fingerprints relative to the current __dirname
  // Path for core.json relative to dist/ (used when running built code/packaged)
  const packagedDistCorePath = resolve(__dirname, 'core.json');
  // Path for core.json relative to src/utils/ (used for local dev via tsx, points to dist)
  const devDistCorePath = resolve(__dirname, '../../dist/core.json');

  // Add logging for path definitions too
  if (debug) {
     console.log(`[Debug Path Def] packagedDistCorePath: ${packagedDistCorePath}`);
     console.log(`[Debug Path Def] devDistCorePath: ${devDistCorePath}`);
  }

  // 1. Try custom file if provided (URL or local path)
  if (customFile) {
    if (debug) {
      console.log(`Attempting to load fingerprints from custom file: ${customFile}`);
    }
    try {
      let content: string;
      if (isUrl(customFile)) {
        // Fetch from URL
        const response = await fetch(customFile);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${customFile}: ${response.statusText}`);
        }
        content = await response.text();
        if (debug) console.log(`Successfully fetched content from URL: ${customFile}`);
      } else {
        // Read from local file path
        const resolvedPath = resolve(process.cwd(), customFile); // Resolve relative to CWD
        if (!existsSync(resolvedPath)) {
          throw new Error(`Custom fingerprint file not found at: ${resolvedPath}`);
        }
        content = await readFile(resolvedPath, 'utf-8');
        if (debug) console.log(`Successfully read content from local file: ${resolvedPath}`);
      }

      const fingerprints = JSON.parse(content);
      if (debug) {
         console.log(`Loaded ${Object.keys(fingerprints).length} fingerprints from custom file: ${customFile}`);
      }
      return fingerprints; // Return immediately if custom file is successfully loaded

    } catch (error) {
      if (debug) {
        console.error(`Failed to load fingerprints from custom file ${customFile}:`, error);
      }
      // Fall through to other loading methods if custom file fails
    }
  }

  // 2. Try custom directory if provided (and custom file didn't load)
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
  
  // 3. Try loading dist/core.json (handling both packaged and local dev contexts)
  let corePathToTry: string | null = null;
  let loadedFingerprints: Record<string, any> | null = null;

  // Check packaged path first
  if (existsSync(packagedDistCorePath)) {
      corePathToTry = packagedDistCorePath;
      if (debug) console.log(`[Debug] Found potential core.json at packaged path: ${corePathToTry}`);
  } 
  // If packaged path doesn't exist, check dev path (pointing to dist)
  else if (existsSync(devDistCorePath)) {
      corePathToTry = devDistCorePath;
      if (debug) console.log(`[Debug] Found potential core.json at dev->dist path: ${corePathToTry}`);
  } else {
      if (debug) {
          console.log(`[Debug] Neither packaged path (${packagedDistCorePath}) nor dev->dist path (${devDistCorePath}) exists.`);
      }
  }

  // If a potential path was found, try loading it
  if (corePathToTry) {
      if (debug) console.log(`Attempting to load fingerprints from: ${corePathToTry}`);
      try {
          const content = await fsPromises.readFile(corePathToTry, 'utf-8');
          loadedFingerprints = JSON.parse(content);
          // Check if loadedFingerprints is not null before using
          if (loadedFingerprints && debug) {
              console.log(`Loaded ${Object.keys(loadedFingerprints).length} fingerprints from ${corePathToTry}`);
          }
          // Check if loadedFingerprints is not null before returning
          if (loadedFingerprints) {
            return loadedFingerprints; // Success!
          }
      } catch (error) {
          if (debug) {
              console.error(`Failed to load/parse core.json from ${corePathToTry}:`, error);
          }
          // Fall through if loading/parsing fails
      }
  }
  
  // Final fallback if nothing worked
  if (debug) {
    console.error('No fingerprints could be loaded from any source (Custom Dir or dist/core.json)');
  }
  return {};
} 