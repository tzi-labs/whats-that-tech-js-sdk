![255c0691-b785-467d-95cf-a0a4a35fcf5b](https://github.com/user-attachments/assets/7c804d73-d067-4f04-b439-78ecaa0eefb6)

The first open-sourced, crowd-sourced logic for detecting most of the web technologies powering the internet today.
Designed for transparency, speed, and community-driven contributions — this framework identifies frameworks, CMSs, analytics, and more using simple, readable rules anyone can extend.

## Features

- 🔍 Accurate technology detection using multiple strategies
- 🎯 Multiple detection methods (global variables, selectors, network requests, etc.)
- 📊 Detailed detection results with categories
- 🚀 Fast and efficient scanning
- 🔄 Support for custom fingerprints
- 🎨 Beautiful and modern UI
- 📱 Responsive design
- 🔍 Category-based filtering
- 🧪 Built-in test fixtures for validation

## Installation

```sh
# npm
npm install fetch-tech

# yarn
yarn add fetch-tech

# pnpm
pnpm add fetch-tech

# bun
bun add fetch-tech
```

> **Note**: This package uses Git submodules for technology fingerprints. The submodules will be automatically initialized during installation. If you're cloning the repository directly, make sure to run `git submodule update --init --recursive` after cloning.

## Quick Start

```ts
import { findTech } from 'fetch-tech';

// Basic usage
const results = await findTech({
  url: 'https://example.com'
});

// With progress tracking and specific categories
const results = await findTech({
  url: 'https://example.com',
  categories: ['framework', 'cms'], // Only detect frameworks and CMSs
  headless: true,
  timeout: 30000,
  onProgress: (progress) => {
    console.log(`Processing: ${progress.currentUrl}`);
  }
});
```

## API Reference

### `findTech(options: FindTechOptions)`

Detects technologies used on a website.

**Parameters:**
```ts
interface FindTechOptions {
  url: string;                    // URL to scan
  headless?: boolean;            // Run browser in headless mode (default: true)
  timeout?: number;              // Request timeout in ms (default: 30000)
  categories?: string[];         // Specific categories to detect (e.g., ['framework', 'cms'])
  excludeCategories?: string[];  // Categories to exclude from detection
  customFingerprintsDir?: string; // Directory for custom fingerprints
  onProgress?: (progress: {      // Progress callback
    current: number;
    total: number;
    currentUrl: string;
    status: 'processing' | 'completed' | 'error';
    error?: string;
  }) => void;
}
```

**Returns:**
```ts
interface DetectionResult {
  name: string;          // Technology name
  categories: string[];  // Technology categories
  detected: boolean;     // Whether the technology was detected
  details?: {           // Additional detection details
    [key: string]: boolean;
  };
  framework?: {         // Framework information (if applicable)
    name: string;
    version: string | null;
  };
  theme?: {            // Theme information (if applicable)
    name: string | null;
    version: string | null;
  };
}
```

## Detection Strategies

The SDK uses multiple strategies to detect technologies:

| Strategy | Description | Example |
|----------|-------------|---------|
| `globalVariables` | Checks for global JavaScript variables | `window.React`, `window.jQuery` |
| `requestUrlRegex` | Matches URLs of external resources | `react\\.js`, `jquery\\.js` |
| `metaTagCheck` | Looks for specific meta tags | `<meta name="generator" content="WordPress">` |
| `selectorExists` | Checks for DOM elements/attributes | `[data-react]`, `[data-vue]` |
| `htmlRegex` | Raw HTML pattern matching | `<!-- React -->`, `<!-- Vue -->` |
| `themeDetection` | Infers themes/templates | WordPress themes, Shopify themes |

## Examples

### Basic Usage
```ts
const results = await findTech({
  url: 'https://example.com'
});

console.log('Detected technologies:', results);
```

### With Category Filtering
```ts
const results = await findTech({
  url: 'https://example.com',
  categories: ['framework', 'cms'], // Only detect frameworks and CMSs
  excludeCategories: ['analytics']  // Exclude analytics tools
});
```

### With Progress Tracking
```ts
const results = await findTech({
  url: 'https://example.com',
  onProgress: (progress) => {
    console.log(`Status: ${progress.status}`);
    console.log(`URL: ${progress.currentUrl}`);
  }
});
```

### Using Custom Fingerprints

You can use your own private fingerprints by creating a `fingerprints` directory in your project root:

```ts
const results = await findTech({
  url: 'https://example.com',
  customFingerprintsDir: './fingerprints'
});
```

Your custom fingerprints should follow this structure:
```json
{
  "name": "your-technology",
  "categories": ["category1", "category2"],
  "detectors": {
    "globalVariables": ["window.yourTech"],
    "selectorExists": ["[data-your-tech]"],
    "requestUrlRegex": "your-tech\\.js"
  }
}
```

Directory structure:
```