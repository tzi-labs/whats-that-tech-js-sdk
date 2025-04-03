import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

export async function loadFingerprints(): Promise<Record<string, any>> {
  const coreDir = process.env.CORE_DIR || 'node_modules/whats-that-tech-core';
  
  try {
    const techDirs = await readdir(coreDir);
    const fingerprints: Record<string, any> = {};
    
    for (const tech of techDirs) {
      const fingerprintPath = join(coreDir, tech, `${tech}.json`);
      try {
        const content = await readFile(fingerprintPath, 'utf-8');
        fingerprints[tech] = JSON.parse(content);
      } catch (error) {
        console.warn(`Failed to load fingerprint for ${tech}:`, error);
      }
    }
    
    return fingerprints;
  } catch (error) {
    console.error('Failed to load fingerprints:', error);
    return {};
  }
} 