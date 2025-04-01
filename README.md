![255c0691-b785-467d-95cf-a0a4a35fcf5b](https://github.com/user-attachments/assets/7c804d73-d067-4f04-b439-78ecaa0eefb6)

The first open-sourced, crowd-sourced logic for detecting most of the web technologies powering the internet today.
Designed for transparency, speed, and community-driven contributions — this framework identifies frameworks, CMSs, analytics, and more using simple, readable rules anyone can extend.

## Features

- 🎯 Multiple detection methods (global variables, selectors, network requests, etc.)
- 📊 Detailed detection results with categories
- 🚀 Fast and efficient scanning
- 🔄 Support for custom fingerprints
- 🧪 Built-in test fixtures for validation

## Installation

```sh
# npm
npm install whats-that-tech

# yarn
yarn add whats-that-tech

# pnpm
pnpm add whats-that-tech

# bun
bun add whats-that-tech
```

> **Note**: This package uses Git submodules for technology fingerprints. The submodules will be automatically initialized during installation. If you're cloning the repository directly, make sure to run `git submodule update --init --recursive` after cloning.

## Quick Start

```ts
import { findTech } from 'whats-that-tech';

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

## Testing

To run the example files:

```bash
# Run the simple example
pnpm ts-node examples/simple-raw-results.ts

# Run other examples (if available)
pnpm ts-node examples/with-categories.ts
pnpm ts-node examples/with-progress.ts
```

Each technology also has test fixtures to ensure accurate detection:

- `*.pass.html`: Positive detection case
- `*.fail.html`: Negative case

These fixtures help validate detectors and prevent false positives/negatives. As hardcoding URLs that would pass tests today, may not pass the same test tomorrow. To update the test files and tech detector settings you must use whatsthattech-core - https://github.com/tzi-labs/whatsthattech-core.

You can simply just modify the "fingerprints" folder in the root of this SDK as well, create a branch with your updates and it will automaticly become a branch here - https://github.com/tzi-labs/whatsthattech-core. See Contributing section for more details.

## Contributing

To add new technology fingerprints:

1. Fork the SDK repository
2. Create a new branch for your fingerprint
3. Add your fingerprint JSON file in the appropriate directory
4. Add test fixtures (pass.html and fail.html)
5. Commit and push your changes
6. Create a PR to the SDK repository

## Who It's For

Built for:
- Technical SEO experts
- Dev tool makers
- Security researchers
- Growth hackers
- Competitive analysts

## License

MIT License  
Copyright © 2025 [tzi-labs](https://github.com/tzi-labs) 

