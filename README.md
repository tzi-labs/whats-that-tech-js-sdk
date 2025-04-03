![255c0691-b785-467d-95cf-a0a4a35fcf5b](https://github.com/user-attachments/assets/7c804d73-d067-4f04-b439-78ecaa0eefb6)

The first open-sourced, crowd-sourced logic for detecting most of the web technologies powering the internet today.
Designed for transparency, speed, and community-driven contributions — this framework identifies frameworks, CMSs, analytics, and more using simple, readable rules anyone can extend.

## Features

- 🎯 Multiple detection methods (global variables, selectors, network requests, etc.)
- 📊 Detailed detection results with categories
- 🚀 Fast and efficient scanning
- 🔄 Support for custom fingerprints
- 🧪 Built-in test fixtures for validation


## Roadmap

Coming soon:
- Extend base "fingerprints" with your own custom fingerprints that are not in https://github.com/tzi-labs/whats-that-tech-core
- 🌐 Cloudflare Workers SDK
- 🐍 Python SDK
- 🐘 PHP SDK
- 🐹 Go SDK

Each SDK will maintain the same core detection logic (using git submodule of https://github.com/tzi-labs/whats-that-tech-core) while providing language-specific optimizations and idiomatic APIs.

## Installation

```bash
pnpm add whats-that-tech
```

## Usage

### Basic Usage

```typescript
import { findTech } from 'whats-that-tech';

const results = await findTech({
  url: 'https://example.com',
  headless: true
});

console.log(results);
```

### With Progress Updates

```typescript
import { findTech } from 'whats-that-tech';

const results = await findTech({
  url: 'https://example.com',
  headless: true,
  onProgress: (progress) => {
    console.log(progress);
  }
});

console.log(results);
```

### Running Examples

```bash
# Basic example
pnpm tsx examples/simple-raw-results.ts

# Example with progress updates
pnpm tsx examples/chunking-batch-crawl.ts
```

## API

### `findTech(options: FindTechOptions): Promise<DetectionResult[]>`

#### Options

- `url` (string): The URL to analyze
- `headless` (boolean, optional): Whether to run in headless mode (default: true)
- `timeout` (number, optional): Timeout in milliseconds (default: 30000)
- `categories` (string[], optional): Specific categories to detect
- `excludeCategories` (string[], optional): Categories to exclude from detection
- `customFingerprintsDir` (string, optional): Directory for custom fingerprints
- `onProgress` (function, optional): Callback for progress updates

#### Progress Updates

The `onProgress` callback receives an object with the following properties:

- `current` (number): Current URL being processed
- `total` (number): Total number of URLs to process
- `currentUrl` (string): URL currently being processed
- `status` ('processing' | 'completed' | 'error'): Current status
- `error` (string, optional): Error message if status is 'error'

#### Return Value

Returns a promise that resolves to an array of `DetectionResult` objects, each containing:

- `name` (string): Name of the detected technology
- `categories` (string[]): Categories the technology belongs to
- `detected` (boolean): Whether the technology was detected

## License

MIT

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
  customFingerprintsDir: './super-secret-fingerprints'
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
pnpm tsx examples/simple-raw-results.ts

# Run other examples (if available)
pnpm tsx examples/exclude-pixels.ts
pnpm tsx examples/chunking-batch-crawl.ts
```

Each technology also has test fixtures to ensure accurate detection:

- `*.pass.html`: Positive detection case
- `*.fail.html`: Negative case

These fixtures help validate detectors and prevent false positives/negatives. As hardcoding URLs that would pass tests today, may not pass the same test tomorrow. To update the test files and tech detector settings you must use whatsthattech-core - https://github.com/tzi-labs/whatsthattech-core.

You can simply just modify the "fingerprints" folder in the root of this SDK as well, create a branch with your updates and it will automaticly become a branch here - https://github.com/tzi-labs/whatsthattech-core. See Contributing section for more details.

## Contributing

### Contributing to Core Fingerprints

The core technology fingerprints are maintained in a separate repository: [whats-that-tech-core](https://github.com/tzi-labs/whats-that-tech-core). To contribute to the core fingerprints:

1. Clone the core repository locally:
   ```bash
   pnpm setup:local
   ```
   This will create a `core` directory in your project root. Once cloned, the SDK will automatically use this local `core` directory instead of the one from node_modules, allowing you to make and test changes immediately.

2. Make your changes to the fingerprints in the `core` directory:
   - Add new fingerprint JSON files in the appropriate category directory
   - Add test fixtures (pass.html and fail.html) in the tech's test directory
   - Update existing fingerprints as needed
   - Your changes will be immediately reflected when running the SDK locally

3. Create a new branch in the core repository:
   ```bash
   cd core
   git checkout -b feature/your-new-tech
   git add .
   git commit -m "feat: add new tech detection"
   git push origin feature/your-new-tech
   ```

4. Create a Pull Request to the [whats-that-tech-core](https://github.com/tzi-labs/whats-that-tech-core) repository

### Contributing to the SDK

To contribute to the SDK itself:

1. Fork the SDK repository
2. Create a new branch for your changes
3. Make your changes
4. Commit and push your changes
5. Create a PR to the SDK repository

## Who It's For

Built for:
- Technical SEO experts
- Dev tool makers
- Security researchers
- Growth hackers
- Competitive analysts

## License

MIT License  
Copyright © 2024 [tzi-labs](https://github.com/tzi-labs) 

## Cloudflare Workers Support

The SDK includes support for Cloudflare Workers, allowing you to run technology detection directly in Cloudflare's edge network. This is particularly useful for serverless applications and edge computing scenarios.

### Installation

```bash
pnpm add whats-that-tech
```

### Usage in Cloudflare Workers

```typescript
import { findTech } from 'whats-that-tech/cloudflare';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url).searchParams.get('url');
    
    if (!url) {
      return new Response('Please provide a URL parameter', { status: 400 });
    }

    try {
      const results = await findTech({
        url,
        timeout: 30000,
        onProgress: (progress) => {
          console.log(`Status: ${progress.status}`);
          console.log(`URL: ${progress.currentUrl}`);
        }
      }, env);

      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
```

### Configuration

To use the Cloudflare version, you need to:

1. Enable the Browser Rendering API in your Cloudflare Workers project
2. Add the browser binding to your `wrangler.toml`:

```toml
[[browser]]
binding = "MYBROWSER"
```

3. Deploy your worker:

```bash
cd examples
wrangler deploy
```

### Example Worker

A complete example worker is available in the `examples` directory. To run it:

```bash
# Build the project
pnpm build

# Deploy the worker
cd examples
wrangler deploy
```

The worker will be available at your worker's URL with a `?url=` parameter:

```
https://your-worker.workers.dev/?url=https://example.com
```

