![255c0691-b785-467d-95cf-a0a4a35fcf5b](https://github.com/user-attachments/assets/7c804d73-d067-4f04-b439-78ecaa0eefb6)

The first open-sourced, crowd-sourced logic for detecting most of the web technologies powering the internet today.
Designed for transparency, speed, and community-driven contributions — this framework identifies frameworks, CMSs, analytics, and more using simple, readable rules anyone can extend.

## Features

- 🎯 Multiple detection methods (global variables, selectors, network requests, etc.)
- 📊 Detailed detection results with categories
- 🚀 Fast and efficient scanning
- 🔄 Support for custom fingerprints
- 🧪 Built-in test fixtures for validation
- 📦 Bundled core fingerprints for easy deployment


## Roadmap

Coming soon:
- 🌐 Cloudflare Workers SDK
- 🐍 Python SDK
- 🐘 PHP SDK
- 🐹 Go SDK

Each SDK will maintain the same core detection logic while providing language-specific optimizations and idiomatic APIs.

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
- `customFingerprintsDir` (string, optional): Directory containing custom fingerprints (Node.js only). Each technology should have its own JSON file (e.g., `customDir/wordpress/wordpress.json`). Takes precedence over default fingerprints.
- `customFingerprintsFile` (string, optional): Path (Node.js) or URL (Node.js/Cloudflare) to a single JSON file containing all custom fingerprints. Takes precedence over `customFingerprintsDir` and default fingerprints.
- `debug` (boolean, optional): Enable debug logging to see fingerprint loading and detection details.
- `onProgress` (function, optional): Callback for progress updates.

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

### Debug Mode

When debug mode is enabled (`debug: true`), the SDK will output detailed information about:

```typescript
const results = await findTech({
  url: 'https://example.com',
  debug: true // Enable debug logging
});
```

Debug output includes:
- Current working directory
- Fingerprint search paths (local core, node_modules, dist)
- Successfully loaded fingerprints
- Technologies detected during scanning

Example debug output:
```bash
Current working directory: /your/project
Looking for fingerprints in:
- Local core: /your/project/core
- Node modules: /your/project/node_modules/whats-that-tech-core
- Dist core: /your/project/dist/core.json
- Root core: /your/project/core.json

Loading fingerprints from: /your/project/node_modules/whats-that-tech-core
Loaded fingerprint for wordpress
Loaded fingerprint for shopify
...

Detected wordpress with categories: ["cms"]
Detected shopify with categories: ["ecommerce"]
```

This is particularly useful when:
- Developing new fingerprints
- Debugging detection issues
- Understanding where fingerprints are being loaded from
- Verifying which technologies are being detected

## Fingerprints

The SDK uses technology fingerprints defined in JSON format. By default, it loads a bundled `core.json` file (in production/packaged builds) or looks for fingerprints in specific locations during development (see below).

### Fingerprint Loading Priority

Fingerprints are loaded with the following priority (highest first):

1.  **`customFingerprintsFile`**: If provided (as a local path in Node.js or a URL in Node.js/Cloudflare), this single JSON file containing all fingerprints is loaded and used exclusively.
2.  **`customFingerprintsDir`**: If `customFingerprintsFile` is not used and this directory path is provided (Node.js only), the SDK attempts to load JSON files from subdirectories within this path (e.g., `yourDir/techName/fingerprint.json`). If successful, these fingerprints are used exclusively.
3.  **Default Paths**: If neither custom option is used, the SDK searches for fingerprints in default locations:
    *   **Packaged/Production**: Looks for `dist/core.json` relative to the package.
    *   **Local Development (`tsx`/`ts-node`)**: Looks for `dist/core.json` relative to the `src/utils` directory.
    *   **Note**: The previous behavior of looking in `node_modules/whats-that-tech-core` or a local `core` directory during development is simplified; the build process now typically handles generating the `dist/core.json` needed for development runs.

### Custom Fingerprints

You have two ways to use custom fingerprints:

1.  **Single File (`customFingerprintsFile`)**: Provide a path or URL to a JSON file that matches the structure of the `core.json` bundle (i.e., a root object where keys are technology names and values are the corresponding fingerprint objects).

    ```ts
    // Node.js (local path or URL)
    const results = await findTech({
      url: 'https://example.com',
      customFingerprintsFile: './path/to/my-fingerprints.json' // or 'https://example.com/my-fingerprints.json'
    });

    // Cloudflare Worker (URL only)
    // (Assuming findTech is imported appropriately for the worker context)
    const results = await findTech({
      url: 'https://example.com',
      customFingerprintsFile: 'https://example.com/my-fingerprints.json'
    }, env);
    ```

2.  **Directory (`customFingerprintsDir` - Node.js only)**: Create a directory and place individual fingerprint JSON files within subdirectories named after the technology.

    ```
    my-fingerprints/
    ├── my-cool-tech/
    │   └── fingerprint.json
    └── another-tech/
        └── config.json // File name must end with .json
    ```

    ```ts
    const results = await findTech({
      url: 'https://example.com',
      customFingerprintsDir: './my-fingerprints'
    });
    ```

Your custom fingerprint JSON (either the single file or individual files in the directory) should follow this structure:

```json
// Example for a single technology (e.g., in my-fingerprints/my-cool-tech/fingerprint.json
// OR as a value within the main object of customFingerprintsFile)
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

These fixtures help validate detectors and prevent false positives/negatives.

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

## Cloudflare Worker Usage

This package also includes an entry point specifically for Cloudflare Workers. The core `findTech` function works similarly, but with a few key differences:

- **Environment**: It requires the Cloudflare environment object (`env`) containing the Puppeteer browser binding (`MYBROWSER`).
- **Fingerprints**: 
    - It **does not** use the hardcoded `FINGERPRINTS` constant anymore.
    - By default, it expects fingerprints to be provided via the `customFingerprintsFile` option (URL only).
    - The `customFingerprintsDir` option is not supported in the Cloudflare environment.
- **Dependencies**: Uses `@cloudflare/puppeteer`.

```typescript
// Example worker entry (e.g., src/worker.ts)
import { findTech } from 'whats-that-tech/cloudflare'; // Note the /cloudflare import

export default {
  async fetch(request: Request, env: { MYBROWSER: any }, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');
    const customFpFile = url.searchParams.get('fingerprints'); // Example: get URL from query param

    if (!targetUrl) {
      return new Response('Missing target URL parameter', { status: 400 });
    }
    if (!customFpFile) {
        return new Response('Missing fingerprints URL parameter', { status: 400 });
    }

    try {
      const results = await findTech({
        url: targetUrl,
        customFingerprintsFile: customFpFile // Must be a URL
      }, env);
      return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error('Error in findTech:', error);
      return new Response(`Error detecting tech: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
    }
  },
};
```

Make sure your `wrangler.toml` includes the browser binding:

```toml
[[browser]]
binding = "MYBROWSER"
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

These fixtures help validate detectors and prevent false positives/negatives.

