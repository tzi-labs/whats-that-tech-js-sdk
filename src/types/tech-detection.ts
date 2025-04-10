export interface Request {
  url: string;
  method: string;
  resourceType: string;
}

export interface CrawlData {
  html: string;
  requests: Request[];
  cookies: any[];
  url: string;
}

export interface DetectionDetails {
  [key: string]: boolean;
}

export interface FrameworkInfo {
  name: string;
  version: string | null;
  vueVersion?: string | null;
  buildId?: string;
  reactVersion?: string;
}

export interface ThemeInfo {
  name: string | null;
  version: string | null;
}

export interface DetectionResult {
  name: string;
  categories: string[];
  detected: boolean;
  details?: DetectionDetails;
  framework?: FrameworkInfo;
  theme?: ThemeInfo;
}

export interface FingerprintDetectors {
  htmlContains?: string[];
  htmlRegex?: string;
  requestUrlRegex?: string | string[];
  cssCommentRegex?: string;
  globalVariables?: string[];
  selectorExists?: string[];
  metaTagCheck?: {
    name: string;
    contentRegex: string;
  };
  themeDetection?: {
    stylesheetRegex?: string;
    bodyClassRegex?: string;
  };
}

export interface Fingerprint {
  name: string;
  categories?: string[];
  detectors: FingerprintDetectors;
  themeDetection?: {
    method?: string;
    globalPath?: string;
    cssLinkRegex?: string;
    stylesheetRegex?: string;
    bodyClassRegex?: string;
    cssIdentifierRegex?: string;
  };
}

// Window interface extensions for framework detection
declare global {
  interface Window {
    React?: {
      version?: string;
    };
    Vue?: {
      version?: string;
    };
    __VUE_DEVTOOLS_GLOBAL_HOOK__?: {
      Vue?: {
        version?: string;
      };
    };
    __NUXT__?: {
      version?: string;
    };
    __sveltekit?: {
      version?: string;
    };
    Shopify?: {
      theme?: {
        name?: string;
        id?: string;
        theme_store_id?: string;
        role?: string;
      };
    };
  }
} 