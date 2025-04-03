import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

interface Fingerprint {
  name: string;
  categories?: string[];
  detectors: {
    htmlContains?: string[];
    htmlRegex?: string;
    requestUrlRegex?: string | string[];
    selectorExists?: string[];
    globalVariables?: string[];
    cssCommentRegex?: string;
  };
}

async function loadFingerprints(): Promise<Record<string, Fingerprint>> {
  // Try local core directory first
  let coreDir = 'core';
  
  try {
    // Check if local core exists
    await readdir(coreDir);
    console.log('Using local core directory');
  } catch {
    // Fall back to node_modules
    coreDir = 'node_modules/whats-that-tech-core';
    console.log('Using node_modules core directory');
  }
  
  try {
    const techDirs = await readdir(coreDir);
    console.log('Found technology directories:', techDirs);
    
    const fingerprints: Record<string, Fingerprint> = {};
    
    for (const tech of techDirs) {
      const fingerprintPath = join(coreDir, tech, `${tech}.json`);
      try {
        const content = await readFile(fingerprintPath, 'utf-8');
        fingerprints[tech] = JSON.parse(content);
        console.log(`Loaded fingerprint for ${tech}`);
      } catch (error) {
        console.warn(`Failed to load fingerprint for ${tech}:`, error);
      }
    }
    
    console.log(`Loaded ${Object.keys(fingerprints).length} fingerprints`);
    return fingerprints;
  } catch (error) {
    console.error('Failed to load fingerprints:', error);
    return {};
  }
}

async function main() {
  const fingerprints = await loadFingerprints();
  
  if (Object.keys(fingerprints).length === 0) {
    console.error('No fingerprints loaded!');
    process.exit(1);
  }
  
  const cloudflareTs = `
/// <reference types="@cloudflare/workers-types" />
import puppeteer from '@cloudflare/puppeteer';
import { DetectionResult } from './types/tech-detection';

interface FindTechOptions {
  url: string;
  timeout?: number;
  categories?: string[];
  excludeCategories?: string[];
  onProgress?: (progress: { current: number; total: number; currentUrl: string; status: 'processing' | 'completed' | 'error'; error?: string }) => void;
}

interface Fingerprint {
  name: string;
  categories?: string[];
  detectors: {
    htmlContains?: string[];
    htmlRegex?: string;
    requestUrlRegex?: string | string[];
    selectorExists?: string[];
    globalVariables?: string[];
    cssCommentRegex?: string;
  };
}

const FINGERPRINTS: Record<string, Fingerprint> = ${JSON.stringify(fingerprints, null, 2)};

export async function findTech(options: FindTechOptions, env: { MYBROWSER: any }): Promise<DetectionResult[]> {
  const { url, timeout = 30000, categories, excludeCategories, onProgress } = options;
  
  onProgress?.({
    current: 1,
    total: 1,
    currentUrl: url,
    status: 'processing'
  });

  try {
    const browser = await puppeteer.launch(env.MYBROWSER);
    const page = await browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout });
      const results = await processSingleUrl(page, categories, excludeCategories);
      
      onProgress?.({
        current: 1,
        total: 1,
        currentUrl: url,
        status: 'completed'
      });
      
      return results;
    } finally {
      await browser.close();
    }
  } catch (error) {
    onProgress?.({
      current: 1,
      total: 1,
      currentUrl: url,
      status: 'error',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

async function processSingleUrl(
  page: any,
  categories?: string[],
  excludeCategories?: string[]
): Promise<DetectionResult[]> {
  const results: DetectionResult[] = [];
  
  // Process all fingerprints
  for (const [tech, fingerprint] of Object.entries(FINGERPRINTS)) {
    // Skip if categories are specified and this fingerprint doesn't match
    if (categories && fingerprint.categories) {
      const hasMatchingCategory = fingerprint.categories.some((cat: string) => categories.includes(cat));
      if (!hasMatchingCategory) continue;
    }
    
    // Skip if excluded categories are specified and this fingerprint matches any
    if (excludeCategories && fingerprint.categories) {
      const hasExcludedCategory = fingerprint.categories.some((cat: string) => excludeCategories.includes(cat));
      if (hasExcludedCategory) continue;
    }
    
    const detected = await detectTechnology(page, fingerprint);
    
    results.push({
      name: tech,
      categories: fingerprint.categories || ['unidentified'],
      detected
    });
  }
  
  return results;
}

async function detectTechnology(page: any, fingerprint: Fingerprint): Promise<boolean> {
  const { detectors } = fingerprint;
  
  // Check HTML content
  if (detectors.htmlContains) {
    const html = await page.content();
    if (detectors.htmlContains.some((text: string) => html.includes(text))) {
      return true;
    }
  }
  
  // Check HTML regex
  if (detectors.htmlRegex) {
    const html = await page.content();
    if (new RegExp(detectors.htmlRegex).test(html)) {
      return true;
    }
  }
  
  // Check request URLs
  if (detectors.requestUrlRegex) {
    const requests = await page.evaluate(() => {
      return (globalThis as any).performance.getEntriesByType('resource')
        .map((entry: any) => entry.name);
    });
    
    const regexes = Array.isArray(detectors.requestUrlRegex) 
      ? detectors.requestUrlRegex 
      : [detectors.requestUrlRegex];
    
    if (requests.some((url: string) => 
      regexes.some(regex => new RegExp(regex).test(url))
    )) {
      return true;
    }
  }
  
  // Check selectors
  if (detectors.selectorExists) {
    for (const selector of detectors.selectorExists) {
      if (await page.$(selector)) {
        return true;
      }
    }
  }
  
  // Check global variables
  if (detectors.globalVariables) {
    const globals = await page.evaluate((vars: string[]) => {
      return vars.map((v: string) => (globalThis as any)[v] !== undefined);
    }, detectors.globalVariables);
    
    if (globals.some((exists: boolean) => exists)) {
      return true;
    }
  }
  
  // Check CSS comments
  if (detectors.cssCommentRegex) {
    const styles = await page.evaluate(() => {
      return Array.from((globalThis as any).document.styleSheets)
        .map((sheet: any) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule: any) => rule.cssText)
              .join('\\n');
          } catch {
            return '';
          }
        })
        .join('\\n');
    });
    
    if (new RegExp(detectors.cssCommentRegex).test(styles)) {
      return true;
    }
  }
  
  return false;
}
`;

  await writeFile('src/cloudflare.ts', cloudflareTs);
  console.log('Cloudflare version prepared successfully');
}

main().catch(console.error); 