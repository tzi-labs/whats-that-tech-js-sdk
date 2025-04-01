import puppeteer, { Page } from 'puppeteer';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { DetectionResult } from './types/tech-detection';
import fs from 'fs/promises';

interface FindTechOptions {
  url: string;
  headless?: boolean;
  timeout?: number;
  categories?: string[];         // Specific categories to detect
  excludeCategories?: string[];  // Categories to exclude from detection
  customFingerprintsDir?: string; // Directory for custom fingerprints
  onProgress?: (progress: { current: number; total: number; currentUrl: string; status: 'processing' | 'completed' | 'error'; error?: string }) => void;
}

export async function findTech(options: FindTechOptions): Promise<DetectionResult[]> {
  const { url, headless = true, timeout = 30000, categories, excludeCategories, customFingerprintsDir, onProgress } = options;
  const fingerprintDir = customFingerprintsDir || path.join(__dirname, '..', 'fingerprints');
  const availableCategories = await getCategories(fingerprintDir);
  
  onProgress?.({
    current: 1,
    total: 1,
    currentUrl: url,
    status: 'processing'
  });

  try {
    const results = await processSingleUrl(url, fingerprintDir, availableCategories, headless, timeout, categories, excludeCategories, onProgress);
    onProgress?.({
      current: 1,
      total: 1,
      currentUrl: url,
      status: 'completed'
    });
    return results;
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
  url: string,
  fingerprintDir: string,
  availableCategories: string[],
  headless: boolean,
  timeout: number,
  categories?: string[],
  excludeCategories?: string[],
  onProgress?: FindTechOptions['onProgress']
): Promise<DetectionResult[]> {
  const browser = await puppeteer.launch({ headless });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout });
    
    const results: DetectionResult[] = [];
    
    // Read all fingerprint files
    const allFiles = await readdir(fingerprintDir);
    for (const item of allFiles) {
      const fullPath = path.join(fingerprintDir, item);
      const stats = await fs.stat(fullPath);
      
      if (stats.isDirectory()) {
        const files = await readdir(fullPath);
        for (const file of files) {
          if (!file.endsWith('.json')) continue;
          
          const fingerprintPath = path.join(fullPath, file);
          const fingerprintContent = await readFile(fingerprintPath, 'utf-8');
          const fingerprint = JSON.parse(fingerprintContent);
          
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
          
          // Create a single result with all categories, defaulting to 'unidentified' if none specified
          results.push({
            name: fingerprint.name,
            categories: fingerprint.categories || ['unidentified'],
            detected
          });
        }
      }
    }
    
    return results;
  } finally {
    await browser.close();
  }
}

async function detectTechnology(page: Page, fingerprint: any): Promise<boolean> {
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
      return (window as any).performance.getEntriesByType('resource')
        .map((entry: any) => entry.name);
    });
    
    if (requests.some((url: string) => new RegExp(detectors.requestUrlRegex).test(url))) {
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
      return vars.map((v: string) => (window as any)[v] !== undefined);
    }, detectors.globalVariables);
    
    if (globals.some((exists: boolean) => exists)) {
      return true;
    }
  }
  
  // Check CSS comments
  if (detectors.cssCommentRegex) {
    const styles = await page.evaluate(() => {
      return Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch {
            return '';
          }
        })
        .join('\n');
    });
    
    if (new RegExp(detectors.cssCommentRegex).test(styles)) {
      return true;
    }
  }
  
  return false;
}

async function getCategories(fingerprintDir: string): Promise<string[]> {
  try {
    const items = await readdir(fingerprintDir);
    const categories = await Promise.all(
      items.map(async (item) => {
        const fullPath = path.join(fingerprintDir, item);
        const stats = await fs.stat(fullPath);
        return stats.isDirectory() && !item.startsWith('.') ? item : null;
      })
    );
    return categories.filter((category): category is string => category !== null);
  } catch (error) {
    console.error('Error reading fingerprint directory:', error);
    return [];
  }
}

// CLI support
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Please provide URLs as arguments');
    process.exit(1);
  }

  // Parse options from command line arguments
  const options: FindTechOptions = {
    url: args[0],
    headless: true,
    onProgress: (progress) => {
      console.log(JSON.stringify(progress));
    }
  };

  findTech(options)
    .then(results => {
      console.log(JSON.stringify(results, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
} 