import puppeteer, { Page } from 'puppeteer';
import { DetectionResult } from './types/tech-detection';
import { loadFingerprints } from './utils/fingerprints';

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
  const { url, headless = true, timeout = 30000, categories, excludeCategories, onProgress } = options;
  
  onProgress?.({
    current: 1,
    total: 1,
    currentUrl: url,
    status: 'processing'
  });

  try {
    // Load fingerprints
    const fingerprints = await loadFingerprints();
    if (Object.keys(fingerprints).length === 0) {
      throw new Error('No fingerprints loaded');
    }

    const browser = await puppeteer.launch({ headless });
    const page = await browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout });
      
      const results: DetectionResult[] = [];
      
      // Process each fingerprint
      for (const [tech, fingerprint] of Object.entries(fingerprints)) {
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

// CLI support
if (import.meta.url === `file://${process.argv[1]}`) {
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

  // Run the detection
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