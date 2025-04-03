# Cloudflare Worker Example

This example shows how to use the whats-that-tech SDK in a Cloudflare Worker.

## Prerequisites

1. Install [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Setup

1. Configure your Cloudflare Worker:
   ```bash
   cd examples
   wrangler login
   ```

2. Update the `wrangler.toml` file with your Cloudflare account details:
   - Replace `your-database-id` with your actual D1 database ID (if using D1)
   - Update other settings as needed

3. Deploy the worker:
   ```bash
   wrangler deploy
   ```

## Usage

Once deployed, you can use the worker by making GET requests to your worker's URL with a `url` query parameter:

```
https://your-worker.workers.dev/?url=https://example.com
```

The worker will return a JSON response with the detected technologies:

```json
[
  {
    "name": "React",
    "categories": ["framework"],
    "detected": true
  },
  {
    "name": "WordPress",
    "categories": ["cms"],
    "detected": false
  }
]
```

## Development

To test locally:

```bash
wrangler dev
```

This will start a local development server that you can test against.

## Error Handling

The worker handles various error cases:
- Invalid HTTP methods (only GET is allowed)
- Missing URL parameter
- Errors during technology detection

All errors are returned as JSON responses with appropriate HTTP status codes. 