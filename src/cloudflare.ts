/// <reference types="@cloudflare/workers-types" />
import puppeteer from '@cloudflare/puppeteer';
import { DetectionResult, Fingerprint } from './types/tech-detection';

interface FindTechOptions {
  url: string;
  timeout?: number;
  categories?: string[];
  excludeCategories?: string[];
  customFingerprintsFile?: string; // URL for a custom fingerprints JSON file (Cloudflare env)
  onProgress?: (progress: { current: number; total: number; currentUrl: string; status: 'processing' | 'completed' | 'error'; error?: string }) => void;
}
// Helper to check if a string is a URL (needed here too)
function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

// Fetch custom fingerprints if a URL is provided
async function fetchCustomFingerprints(url: string): Promise<Record<string, Fingerprint> | null> {
  if (!isUrl(url)) {
    console.error(`Custom fingerprints file must be a valid URL in Cloudflare environment: ${url}`);
    return null;
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch custom fingerprints from ${url}: ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    console.log(`Successfully loaded ${Object.keys(data as Record<string, any>).length} custom fingerprints from ${url}`);
    return data as Record<string, Fingerprint>;
  } catch (error) {
    console.error(`Error fetching or parsing custom fingerprints from ${url}:`, error);
    return null;
  }
}

export async function findTech(options: FindTechOptions, env: { MYBROWSER: any }): Promise<DetectionResult[]> {
  const { url, timeout = 30000, categories, excludeCategories, customFingerprintsFile, onProgress } = options;
  
  onProgress?.({
    current: 1,
    total: 1,
    currentUrl: url,
    status: 'processing'
  });

  let activeFingerprints = {}; // Default to hardcoded

  // Attempt to load custom fingerprints if specified
  if (customFingerprintsFile) {
    console.log(`Attempting to load custom fingerprints from file/URL: ${customFingerprintsFile}`);
    const customFingerprints = await fetchCustomFingerprints(customFingerprintsFile);
    if (customFingerprints) {
      activeFingerprints = customFingerprints; // Override with custom ones
    }
  }

  if (Object.keys(activeFingerprints).length === 0) {
    throw new Error('No fingerprints available (default or custom).');
  }

  try {
    const browser = await puppeteer.launch(env.MYBROWSER);
    const page = await browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout });
      const results = await processSingleUrl(page, activeFingerprints, categories, excludeCategories);
      
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
  fingerprintsToUse: Record<string, Fingerprint>, // Pass the active fingerprints
  categories?: string[],
  excludeCategories?: string[]
): Promise<DetectionResult[]> {
  const results: DetectionResult[] = [];
  
  // Process all fingerprints
  for (const [tech, fingerprint] of Object.entries(fingerprintsToUse)) { // Use passed fingerprints
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
