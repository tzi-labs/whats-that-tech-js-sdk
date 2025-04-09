import { Page } from 'puppeteer';
import fs from 'fs';
import { 
  DetectionResult, 
  Fingerprint, 
  DetectionDetails, 
  FrameworkInfo, 
  ThemeInfo 
} from './types/tech-detection';
import { loadFingerprints } from './utils/fingerprints';

interface AnalyzeParams {
  page: Page;
  data: {
    html: string;
    requests: { url: string; method: string; resourceType: string }[];
    cookies: any[];
    url: string;
  };
}

export async function analyze({ page, data }: AnalyzeParams, fingerprintPath?: string): Promise<DetectionResult> {
  let fingerprint: Fingerprint;
  
  if (fingerprintPath) {
    // Use custom fingerprint if path is provided
    fingerprint = JSON.parse(fs.readFileSync(fingerprintPath, 'utf-8'));
  } else {
    // Use core fingerprints by default
    const fingerprints = await loadFingerprints();
    fingerprint = fingerprints as Fingerprint;
  }

  const results: DetectionResult = {
    name: fingerprint.name,
    detected: false,
    details: {},
    categories: []
  };

  // Temporary storage for detection details
  const detectionDetails: DetectionDetails = {};

  if (fingerprint.detectors.htmlContains) {
    for (const pattern of fingerprint.detectors.htmlContains) {
      const found = data.html.includes(pattern);
      detectionDetails[`htmlContains:${pattern}`] = found;
      if (found) results.detected = true;
    }
  }

  if (fingerprint.detectors.htmlRegex) {
    const regex = new RegExp(fingerprint.detectors.htmlRegex, 'g');
    const matches = data.html.match(regex);
    const found = Boolean(matches && matches.length > 10); // Require at least 10 matches for utility class patterns
    detectionDetails[`htmlRegex:${fingerprint.detectors.htmlRegex}`] = found;
    if (found) results.detected = true;
  }

  if (fingerprint.detectors.requestUrlRegex) {
    if (Array.isArray(fingerprint.detectors.requestUrlRegex)) {
      // Handle array of regex patterns
      for (const pattern of fingerprint.detectors.requestUrlRegex) {
        const regex = new RegExp(pattern);
        const match = data.requests.some(req => regex.test(req.url));
        detectionDetails[`requestMatch:${pattern}`] = match;
        if (match) results.detected = true;
      }
    } else {
      // Handle single regex pattern (string)
      const regex = new RegExp(fingerprint.detectors.requestUrlRegex);
      const match = data.requests.some(req => regex.test(req.url));
      detectionDetails[`requestMatch:${fingerprint.detectors.requestUrlRegex}`] = match;
      if (match) results.detected = true;
    }
  }

  if (fingerprint.detectors.cssCommentRegex) {
    const cssCommentFound = await page.evaluate((pattern: string) => {
      // Check all stylesheets for the pattern
      const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      const styleElements = Array.from(document.querySelectorAll('style'));
      
      // Check inline styles first (faster)
      for (const style of styleElements) {
        if (new RegExp(pattern).test(style.textContent || '')) {
          return true;
        }
      }
      
      // We would need to fetch external stylesheets to check them
      // This is a simplified version that just checks if the URL matches
      for (const link of styleLinks) {
        const href = link.getAttribute('href');
        if (href && href.includes('tailwind')) {
          return true;
        }
      }
      
      return false;
    }, fingerprint.detectors.cssCommentRegex);
    
    detectionDetails[`cssCommentRegex:${fingerprint.detectors.cssCommentRegex}`] = Boolean(cssCommentFound);
    if (cssCommentFound) results.detected = true;
  }

  if (fingerprint.detectors.globalVariables) {
    for (const varName of fingerprint.detectors.globalVariables) {
      const exists = await page.evaluate((name: string) => {
        return typeof (window as any)[name] !== 'undefined';
      }, varName);
      detectionDetails[`globalVar:${varName}`] = Boolean(exists);
      if (exists) results.detected = true;
    }
  }

  // Add support for selectorExists detector
  if (fingerprint.detectors.selectorExists) {
    for (const selector of fingerprint.detectors.selectorExists) {
      const exists = await page.evaluate((sel: string) => document.querySelector(sel) !== null, selector);
      detectionDetails[`selectorExists:${selector}`] = Boolean(exists);
      if (exists) results.detected = true;
    }
  }

  // Add support for metaTagCheck detector
  if (fingerprint.detectors.metaTagCheck) {
    const { name, contentRegex } = fingerprint.detectors.metaTagCheck;
    const found = await page.evaluate((metaName: string, contentPattern: string) => {
      const meta = document.querySelector(`meta[name="${metaName}"]`);
      if (!meta) return false;
      const content = meta.getAttribute('content');
      return content && new RegExp(contentPattern).test(content);
    }, name, contentRegex);
    
    detectionDetails[`metaTagCheck:${name}:${contentRegex}`] = Boolean(found);
    if (found) results.detected = true;
  }

  // Only include details if detection is true
  if (results.detected) {
    results.details = detectionDetails;
  }

  // Theme detection for detected platforms
  if (results.detected) {
    // Detect UI frameworks and their versions
    if (['react', 'vue', 'nuxt', 'next', 'svelte', 'sveltekit'].includes(fingerprint.name)) {
      const frameworkInfo = await detectFramework(page, fingerprint.name);
      if (frameworkInfo) {
        results.framework = frameworkInfo;
      }
    } 
    // Detect CMS themes
    else {
      const themeInfo = await detectTheme(page, data, fingerprint);
      if (themeInfo) {
        results.theme = themeInfo;
      }
    }
  }
  
  return results;
}

// Detect UI framework versions
async function detectFramework(page: Page, frameworkName: string): Promise<FrameworkInfo | null> {
  // Default result structure with only name and version
  const frameworkInfo: FrameworkInfo = {
    name: frameworkName,
    version: null
  };
  
  switch (frameworkName) {
    case 'react':
      return await detectReactVersion(page);
    case 'vue':
      return await detectVueVersion(page);
    case 'nuxt':
      return await detectNuxtVersion(page);
    case 'next':
      return await detectNextVersion(page);
    case 'svelte':
    case 'sveltekit':
      return await detectSvelteVersion(page);
    default:
      return null;
  }
}

async function detectReactVersion(page: Page): Promise<FrameworkInfo> {
  const reactInfo: FrameworkInfo = {
    name: 'react',
    version: null
  };
  
  // Method 1: Try to get React version from React global
  const versionFromGlobal = await page.evaluate(() => {
    if (window.React && window.React.version) {
      return window.React.version;
    }
    return null;
  });
  
  if (versionFromGlobal) {
    reactInfo.version = versionFromGlobal;
    return reactInfo;
  }
  
  // Method 2: Check for React version comments in the HTML
  const versionFromComments = await page.evaluate(() => {
    const htmlContent = document.documentElement.innerHTML;
    // Look for React version comments
    const versionComment = htmlContent.match(/React v([0-9]+\.[0-9]+\.[0-9]+)/);
    if (versionComment && versionComment[1]) {
      return versionComment[1];
    }
    return null;
  });
  
  if (versionFromComments) {
    reactInfo.version = versionFromComments;
  }
  
  return reactInfo;
}

async function detectVueVersion(page: Page): Promise<FrameworkInfo> {
  const vueInfo: FrameworkInfo = {
    name: 'vue',
    version: null
  };
  
  // Method 1: Try to get Vue version from Vue global
  const versionFromGlobal = await page.evaluate(() => {
    if (window.Vue && window.Vue.version) {
      return window.Vue.version;
    }
    return null;
  });
  
  if (versionFromGlobal) {
    vueInfo.version = versionFromGlobal;
    return vueInfo;
  }
  
  // Method 2: Try to inspect Vue constructor in devtools
  const versionFromDevtools = await page.evaluate(() => {
    try {
      // This works for Vue 2
      if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__ && window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue) {
        return window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue.version;
      }
    } catch (e) {
      // Ignore errors
    }
    return null;
  });
  
  if (versionFromDevtools) {
    vueInfo.version = versionFromDevtools;
  }
  
  return vueInfo;
}

async function detectNuxtVersion(page: Page): Promise<FrameworkInfo> {
  const nuxtInfo: FrameworkInfo = {
    name: 'nuxt',
    version: null
  };
  
  // Method 1: Try to get Nuxt version from __NUXT__ global
  const nuxtData = await page.evaluate(() => {
    if (window.__NUXT__) {
      // Modern Nuxt might expose version info
      return {
        version: window.__NUXT__.version || null,
        // Also grab Vue version since Nuxt is Vue-based
        vueVersion: window.Vue && window.Vue.version ? window.Vue.version : null
      };
    }
    return null;
  });
  
  if (nuxtData) {
    if (nuxtData.version) {
      nuxtInfo.version = nuxtData.version;
    }
    if (nuxtData.vueVersion) {
      nuxtInfo.vueVersion = nuxtData.vueVersion;
    }
  }
  
  // Method 2: Check for Nuxt version in comments or script attributes
  if (!nuxtInfo.version) {
    const versionFromHTML = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src*="/_nuxt/"]'));
      if (scripts.length > 0) {
        // Sometimes filenames contain versions
        for (const script of scripts) {
          const src = script.getAttribute('src');
          const versionMatch = src?.match(/_nuxt\/([0-9]+\.[0-9]+\.[0-9]+)/);
          if (versionMatch && versionMatch[1]) {
            return versionMatch[1];
          }
        }
      }
      
      // Check for version in HTML comments
      const htmlContent = document.documentElement.innerHTML;
      const versionComment = htmlContent.match(/Nuxt\.js v([0-9]+\.[0-9]+\.[0-9]+)/);
      if (versionComment && versionComment[1]) {
        return versionComment[1];
      }
      
      return null;
    });
    
    if (versionFromHTML) {
      nuxtInfo.version = versionFromHTML;
    }
  }
  
  return nuxtInfo;
}

async function detectNextVersion(page: Page): Promise<FrameworkInfo> {
  const nextInfo: FrameworkInfo = {
    name: 'next',
    version: null
  };
  
  // Method 1: Check for Next.js version in script tags or props
  const versionFromHTML = await page.evaluate(() => {
    // Look for next build manifest script which might contain version info
    const scripts = Array.from(document.querySelectorAll('script[src*="/_next/"]'));
    if (scripts.length > 0) {
      // Check for build ID which can give a hint about the Next.js version
      for (const script of scripts) {
        const src = script.getAttribute('src');
        if (src?.includes('/_next/static/')) {
          const buildIdMatch = src.match(/_next\/static\/([^/]+)/);
          if (buildIdMatch && buildIdMatch[1]) {
            return { buildId: buildIdMatch[1] };
          }
        }
      }
    }
    
    // Check for data-next-version attribute (some Next.js apps might expose this)
    const nextRoot = document.getElementById('__next');
    if (nextRoot && nextRoot.getAttribute('data-next-version')) {
      return { version: nextRoot.getAttribute('data-next-version') };
    }
    
    return null;
  });
  
  if (versionFromHTML) {
    if (versionFromHTML.version) {
      nextInfo.version = versionFromHTML.version;
    } else if (versionFromHTML.buildId) {
      nextInfo.buildId = versionFromHTML.buildId;
    }
  }
  
  // Method 2: Look for React version since Next.js is React-based
  const reactVersion = await page.evaluate(() => {
    if (window.React && window.React.version) {
      return window.React.version;
    }
    return null;
  });
  
  if (reactVersion) {
    nextInfo.reactVersion = reactVersion;
  }
  
  return nextInfo;
}

async function detectSvelteVersion(page: Page): Promise<FrameworkInfo> {
  const svelteInfo: FrameworkInfo = {
    name: 'svelte',
    version: null
  };
  
  // Method 1: Check for SvelteKit data
  const svelteKitData = await page.evaluate(() => {
    // Check for SvelteKit specific globals
    if (window.__sveltekit) {
      return { 
        isSvelteKit: true,
        version: window.__sveltekit.version || null
      };
    }
    
    // Look for data-sveltekit-* attributes which might contain version info
    const svelteKitElements = document.querySelectorAll('[data-sveltekit]');
    if (svelteKitElements.length > 0) {
      const versionElement = Array.from(svelteKitElements).find(el => 
        el.hasAttribute('data-sveltekit-version')
      );
      
      if (versionElement) {
        return {
          isSvelteKit: true,
          version: versionElement.getAttribute('data-sveltekit-version')
        };
      }
      
      return { isSvelteKit: true };
    }
    
    return null;
  });
  
  if (svelteKitData) {
    if (svelteKitData.isSvelteKit) {
      svelteInfo.name = 'sveltekit';
    }
    if (svelteKitData.version) {
      svelteInfo.version = svelteKitData.version;
    }
  }
  
  // Method 2: Check for version in script tags or HTML comments
  if (!svelteInfo.version) {
    const versionFromHTML = await page.evaluate(() => {
      // Check for version comments in the HTML
      const htmlContent = document.documentElement.innerHTML;
      
      // Different version comment patterns
      const versionPatterns = [
        /Svelte v([0-9]+\.[0-9]+\.[0-9]+)/,
        /SvelteKit v([0-9]+\.[0-9]+\.[0-9]+)/
      ];
      
      for (const pattern of versionPatterns) {
        const match = htmlContent.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
      
      return null;
    });
    
    if (versionFromHTML) {
      svelteInfo.version = versionFromHTML;
    }
  }
  
  return svelteInfo;
}

// Unified theme detection function for all platforms
async function detectTheme(
  page: Page, 
  data: { html: string; requests: { url: string }[] }, 
  fingerprint: Fingerprint
): Promise<ThemeInfo | null> {
  // Default result structure with only name and version
  const themeInfo: ThemeInfo = {
    name: null,
    version: null
  };
  
  // WordPress theme detection
  if (fingerprint.name === 'wordpress' && fingerprint.detectors.themeDetection) {
    const wpTheme = await detectWordPressTheme(page, data, fingerprint.detectors.themeDetection);
    if (wpTheme) {
      themeInfo.name = wpTheme.name;
      themeInfo.version = wpTheme.details?.version || null;
    }
  }
  
  // Shopify theme detection
  if (fingerprint.name === 'shopify') {
    const shopifyTheme = await detectShopifyTheme(page);
    if (shopifyTheme) {
      themeInfo.name = shopifyTheme.name;
      themeInfo.version = shopifyTheme.version;
    }
  }
  
  // Only return the theme info if we found at least a name
  return themeInfo.name ? themeInfo : null;
}

async function detectWordPressTheme(
  page: Page, 
  data: { html: string; requests: { url: string }[] }, 
  themeConfig: { stylesheetRegex?: string; bodyClassRegex?: string }
): Promise<{ name: string; details?: { version?: string } } | null> {
  let themeInfo = null;
  
  // Method 1: Check for theme in stylesheet links
  if (themeConfig.stylesheetRegex) {
    const regex = new RegExp(themeConfig.stylesheetRegex);
    
    // Check in HTML content first
    let match = regex.exec(data.html);
    if (match && match[1]) {
      themeInfo = { 
        name: match[1], 
        details: {}
      };
    }
    
    // Check in network requests (for themes loaded via CSS) if not found in HTML
    if (!themeInfo) {
      for (const req of data.requests) {
        match = regex.exec(req.url);
        if (match && match[1]) {
          themeInfo = { 
            name: match[1], 
            details: {}
          };
          break;
        }
      }
    }
  }
  
  // Method 2: Check for theme in body class if not found yet
  if (!themeInfo && themeConfig.bodyClassRegex) {
    const themeFromBodyClass = await page.evaluate((pattern: string) => {
      const bodyClasses = document.body.className;
      const regex = new RegExp(pattern);
      const match = regex.exec(bodyClasses);
      return match && match[1] ? match[1] : null;
    }, themeConfig.bodyClassRegex);
    
    if (themeFromBodyClass) {
      themeInfo = { 
        name: themeFromBodyClass, 
        details: {}
      };
    }
  }
  
  // If we found a theme, try to get the version
  if (themeInfo) {
    // Try to get theme version from style.css
    try {
      const themeUrl = await page.evaluate((themeName: string) => {
        const links = Array.from(document.querySelectorAll(`link[href*="/wp-content/themes/${themeName}/"]`));
        if (links.length > 0) {
          const href = links[0].getAttribute('href');
          const baseUrl = href?.match(/(.*wp-content\/themes\/[^\/]+)\//);
          return baseUrl ? baseUrl[1] : null;
        }
        return null;
      }, themeInfo.name);
      
      if (themeUrl) {
        const styleUrl = `${themeUrl}/style.css`;
        const versionInfo = await page.evaluate(async (url: string) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              const text = await response.text();
              const versionRegex = /Version:\s*([^\n]+)/i;
              const match = versionRegex.exec(text);
              if (match && match[1]) {
                return match[1].trim();
              }
            }
          } catch (e) {
            // Ignore errors
          }
          return null;
        }, styleUrl);
        
        if (versionInfo) {
          themeInfo.details = { version: versionInfo };
        }
      }
    } catch (e) {
      // Ignore errors during theme version extraction
    }
  }
  
  return themeInfo;
}

// New dedicated Shopify theme detector
async function detectShopifyTheme(page: Page): Promise<{ name: string; version: string | null } | null> {
  let themeName = null;
  let themeVersion = null;
  
  // Method 1: Check in Shopify global variables
  const shopifyTheme = await page.evaluate(() => {
    if (window.Shopify && window.Shopify.theme) {
      return {
        name: window.Shopify.theme.name,
        id: window.Shopify.theme.id,
        theme_store_id: window.Shopify.theme.theme_store_id,
        version: window.Shopify.theme.role // Often contains version info in some format
      };
    }
    return null;
  });
  
  if (shopifyTheme) {
    themeName = shopifyTheme.name;
    
    // Try to extract numeric version if available
    if (shopifyTheme.version) {
      const versionMatch = shopifyTheme.version.match(/\d+(\.\d+)*/);
      if (versionMatch) {
        themeVersion = versionMatch[0];
      } else {
        themeVersion = shopifyTheme.version;
      }
    }
  }
  
  // Method 2: Check in theme asset URLs
  if (!themeName) {
    const themeAssetInfo = await page.evaluate(() => {
      // Look for theme asset URLs
      const assetLinks = Array.from(document.querySelectorAll('link[href*="cdn.shopify.com/s/files/"][href*="/assets/"]'));
      
      if (assetLinks.length > 0) {
        // Extract theme name from asset URL if possible
        const href = assetLinks[0].getAttribute('href');
        const themeMatch = href?.match(/\/themes\/([^\/]+)\//);
        if (themeMatch && themeMatch[1]) {
          return { name: themeMatch[1] };
        }
      }
      
      return null;
    });
    
    if (themeAssetInfo && themeAssetInfo.name) {
      themeName = themeAssetInfo.name;
    }
  }
  
  // Method 3: Look for theme info in HTML comments or data attributes
  if (!themeName || !themeVersion) {
    const commentInfo = await page.evaluate(() => {
      // Look for HTML comments with theme info
      const htmlContent = document.documentElement.innerHTML;
      
      // Look for Dawn theme version comment pattern or similar
      const versionComment = htmlContent.match(/Theme version: (\d+\.\d+\.\d+)/);
      
      // Try to find theme name in data attributes
      const themeDataElem = document.querySelector('[data-theme-name], [data-theme-id]');
      const themeName = themeDataElem ? (themeDataElem.getAttribute('data-theme-name') || null) : null;
      
      return {
        name: themeName,
        version: versionComment ? versionComment[1] : null
      };
    });
    
    if (commentInfo) {
      if (commentInfo.name && !themeName) themeName = commentInfo.name;
      if (commentInfo.version && !themeVersion) themeVersion = commentInfo.version;
    }
  }
  
  return themeName ? { name: themeName, version: themeVersion } : null;
} 