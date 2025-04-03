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

### Single URL (GET Request)

For analyzing a single URL, use a GET request with the `url` query parameter:

```
https://your-worker.workers.dev/?url=https://example.com
```

The worker will return a JSON response with the detected technologies:

```json
{
  "results": [
    {
      "url": "https://example.com",
      "data": [
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
    }
  ]
}
```

### Multiple URLs (POST Request)

For analyzing multiple URLs (up to 8), use a POST request with a JSON body:

```bash
curl -X POST \
  https://your-worker.workers.dev \
  -H 'Content-Type: application/json' \
  -d '{
    "urls": [
      "https://example1.com",
      "https://example2.com",
      "https://example3.com"
    ]
  }'
```

The response will include results for all URLs:

```json
{
  "results": [
    {
      "url": "https://example1.com",
      "data": [
        {
          "name": "React",
          "categories": ["framework"],
          "detected": true
        }
      ]
    },
    {
      "url": "https://example2.com",
      "data": [
        {
          "name": "WordPress",
          "categories": ["cms"],
          "detected": true
        }
      ]
    },
    {
      "url": "https://example3.com",
      "data": [
        {
          "name": "Vue",
          "categories": ["framework"],
          "detected": true
        }
      ]
    }
  ]
}
```

## Development

To test locally:

```bash
wrangler dev
```

This will start a local development server that you can test against.

## Error Handling

The worker handles various error cases:
- Invalid HTTP methods (only GET and POST are allowed)
- Missing URL parameter for GET requests
- Invalid JSON body for POST requests
- Too many URLs in POST request (maximum 8)
- Errors during technology detection

All errors are returned as JSON responses with appropriate HTTP status codes. 