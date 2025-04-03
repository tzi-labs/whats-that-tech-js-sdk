
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

const FINGERPRINTS: Record<string, Fingerprint> = {
  "facebook-pixel": {
    "name": "facebook-pixel",
    "categories": [
      "pixel",
      "marketing"
    ],
    "detectors": {
      "requestUrlRegex": "connect\\.facebook\\.net/.*/fbevents\\.js",
      "globalVariables": [
        "fbq"
      ]
    }
  },
  "framer": {
    "name": "framer",
    "detectors": {
      "metaTagCheck": {
        "name": "generator",
        "contentRegex": "Framer"
      },
      "selectorExists": [
        "[data-framer-name]",
        "[data-framer-component-type]",
        "div[data-framer-page-wrapper]"
      ],
      "requestUrlRegex": [
        "events\\.framer\\.com/script"
      ]
    }
  },
  "google-analytics": {
    "name": "google-analytics",
    "categories": [
      "pixel",
      "analytics"
    ],
    "detectors": {
      "globalVariables": [
        "gtag",
        "ga",
        "GoogleAnalyticsObject",
        "__gaTracker"
      ],
      "requestUrlRegex": [
        "google-analytics\\.com/analytics\\.js",
        "googletagmanager\\.com/gtag/js",
        "google-analytics\\.com/collect",
        "analytics\\.google\\.com"
      ]
    }
  },
  "google-tag-manager": {
    "name": "google-tag-manager",
    "detectors": {
      "globalVariables": [
        "dataLayer",
        "google_tag_manager"
      ],
      "requestUrlRegex": [
        "googletagmanager\\.com/gtm\\.js",
        "googletagmanager\\.com/ns\\.html"
      ]
    }
  },
  "gtag": {
    "name": "gtag",
    "detectors": {
      "globalVariables": [
        "gtag"
      ],
      "requestUrlRegex": [
        "googletagmanager\\.com/gtag/js",
        "google-analytics\\.com/g/collect"
      ]
    }
  },
  "hotjar": {
    "name": "hotjar",
    "detectors": {
      "globalVariables": [
        "hj",
        "hjSiteSettings",
        "_hjSettings"
      ],
      "requestUrlRegex": [
        "static\\.hotjar\\.com/c/hotjar-",
        "vars\\.hotjar\\.com",
        "script\\.hotjar\\.com",
        "in\\.hotjar\\.com/api/v2/client/sites"
      ]
    }
  },
  "klaviyo": {
    "name": "klaviyo",
    "detectors": {
      "globalVariables": [
        "_learnq",
        "Klaviyo"
      ],
      "requestUrlRegex": [
        "a\\.klaviyo\\.com/media/js/analytics/analytics\\.js",
        "static\\.klaviyo\\.com/onsite/js/klaviyo\\.js",
        "static\\.klaviyo\\.com/onsite/js/klaviyo\\.min\\.js",
        "a\\.klaviyo\\.com/api/identify",
        "a\\.klaviyo\\.com/api/track"
      ]
    }
  },
  "next": {
    "name": "next",
    "detectors": {
      "globalVariables": [
        "next"
      ],
      "htmlRegex": "(data-next-page|data-next-url|__NEXT_DATA__|__next)"
    }
  },
  "nuxt": {
    "name": "nuxt",
    "detectors": {
      "globalVariables": [
        "__NUXT__",
        "$nuxt"
      ],
      "selectorExists": [
        "#__nuxt",
        "#__layout",
        "[data-n-head]",
        "[data-n-]"
      ]
    }
  },
  "react": {
    "name": "react",
    "categories": [
      "framework",
      "frontend"
    ],
    "detectors": {
      "globalVariables": [
        "React",
        "__REACT_DEVTOOLS_GLOBAL_HOOK__"
      ],
      "selectorExists": [
        "div[data-reactroot]",
        "[data-reactid]",
        "noscript[data-reactroot]",
        "#react-root"
      ]
    }
  },
  "segment": {
    "name": "segment",
    "detectors": {
      "globalVariables": [
        "analytics",
        "analytics.initialize",
        "analytics.invoked"
      ],
      "selectorExists": [
        "script[src*='cdn.segment.com/analytics.js']",
        "script[src*='cdn.segment.com/analytics.min.js']"
      ]
    }
  },
  "shopify": {
    "name": "shopify",
    "categories": [
      "cms",
      "ecommerce"
    ],
    "detectors": {
      "metaTagCheck": {
        "name": "shopify-checkout-api-token",
        "contentRegex": ".*"
      },
      "globalVariables": [
        "Shopify",
        "ShopifyAnalytics"
      ]
    }
  },
  "squarespace": {
    "name": "squarespace",
    "detectors": {
      "globalVariables": [
        "Squarespace"
      ],
      "metaTagCheck": {
        "name": "generator",
        "contentRegex": "Squarespace"
      }
    },
    "themeDetection": {
      "method": "global",
      "globalPath": "Static.SQUARESPACE_CONTEXT.templateName"
    }
  },
  "statamic": {
    "name": "statamic",
    "detectors": {
      "metaTagCheck": {
        "name": "generator",
        "contentRegex": "Statamic"
      },
      "globalVariables": [
        "Statamic"
      ],
      "selectorExists": [
        "[data-statamic]",
        "[data-statamic-field]",
        "[data-statamic-handler]"
      ]
    },
    "themeDetection": {
      "cssLinkRegex": "/themes/([\\w-]+)/"
    }
  },
  "svelte": {
    "name": "svelte",
    "detectors": {
      "globalVariables": [
        "__sveltekit",
        "__SVELTEKIT_DEV__"
      ],
      "selectorExists": [
        "[data-sveltekit]",
        "[data-sveltekit-preload-data]",
        "[data-sveltekit-reload]"
      ]
    }
  },
  "vue": {
    "name": "vue",
    "detectors": {
      "globalVariables": [
        "Vue",
        "__VUE_DEVTOOLS_GLOBAL_HOOK__",
        "VueRouter"
      ],
      "selectorExists": [
        "[data-v-]",
        "#app[data-v-app]",
        "[data-server-rendered='true']"
      ]
    }
  },
  "webflow": {
    "name": "webflow",
    "detectors": {
      "globalVariables": [
        "Webflow"
      ],
      "metaTagCheck": {
        "name": "generator",
        "contentRegex": "Webflow"
      },
      "selectorExists": [
        ".w-webflow-badge"
      ]
    },
    "themeDetection": {
      "cssLinkRegex": "css/([\\w-]+)\\.webflow\\.css"
    }
  },
  "wix": {
    "name": "wix",
    "detectors": {
      "globalVariables": [
        "wixBiSession",
        "wixSdk"
      ],
      "metaTagCheck": {
        "name": "generator",
        "contentRegex": "Wix\\.com"
      },
      "selectorExists": [
        "div[class*='wixui-']"
      ]
    }
  },
  "wordpress": {
    "name": "wordpress",
    "detectors": {
      "metaTagCheck": {
        "name": "generator",
        "contentRegex": "WordPress"
      },
      "selectorExists": [
        "script[src*='wp-includes']",
        "body.wp-",
        "#wpadminbar"
      ],
      "globalVariables": [
        "wp",
        "wpApiSettings",
        "wc"
      ],
      "themeDetection": {
        "stylesheetRegex": "wp-content\\/themes\\/([-\\w]+)",
        "bodyClassRegex": "theme-([-\\w]+)",
        "cssIdentifierRegex": "Theme Name:\\s*([^\\n]+)"
      }
    }
  }
};

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
