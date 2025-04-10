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

## Consuming the Output

### Standard JSON Response

By default (or if you set `Accept: application/json`), the worker processes all URLs concurrently and returns a single JSON array containing the results for each URL once all are complete.

```bash
curl -X POST \
  YOUR_WORKER_URL \
  -H 'Content-Type: application/json' \
  -d '{
    "urls": [
      "https://example.com",
      "https://google.com"
    ]
  }'
# Output will be a JSON response after both URLs are processed
```

### Server-Sent Events (SSE) Streaming

If you want results streamed as they become available (ideal for multiple URLs or long-running scans), you can request Server-Sent Events.

**1. Using `curl`:**

Add the `Accept: text/event-stream` header.

```bash
curl -X POST \
  YOUR_WORKER_URL \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/event-stream' \
  -d '{
    "urls": [
      "https://example.com",
      "https://google.com"
    ]
  }'
# Output will be a stream of events
```

**2. Consuming the Stream in Code (e.g., Node.js):**

You can use `fetch` to make the POST request and process the resulting stream.

```javascript
// Example using Node.js (requires Node 18+ for fetch or use node-fetch)
async function consumeTechStream(workerUrl, urlsToScan) {
  try {
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream' // Request SSE
      },
      body: JSON.stringify({ urls: urlsToScan })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    console.log('Connected to SSE stream...');

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log('Stream finished.');
        break;
      }

      // Decode and append to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete messages (split by double newline)
      const messages = buffer.split('\n\n');
      buffer = messages.pop() || ''; // Keep the last partial message

      for (const msg of messages) {
        if (msg.startsWith('data:')) {
          try {
            const jsonData = msg.substring(5).trim(); // Remove "data:" prefix
            const event = JSON.parse(jsonData);

            // Process the event based on its type
            switch (event.type) {
              case 'url_processing':
                console.log(`[${event.url}] Started processing...`);
                break;
              case 'tech_detected':
                console.log(`[${event.url}] Detected: ${event.tech.name} (${event.tech.categories.join(', ')})`);
                break;
              case 'url_completed':
                console.log(`[${event.url}] Finished processing.`);
                break;
              case 'url_error':
                console.error(`[${event.url}] Error: ${event.error}`);
                break;
              default:
                console.warn('Received unknown event type:', event);
            }
          } catch (parseError) {
            console.error('Error parsing SSE data:', parseError, 'Raw data:', msg);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error consuming SSE stream:', error);
  }
}

// --- Usage ---
const MY_WORKER_URL = 'YOUR_WORKER_URL'; // Replace with your worker URL
const urls = ['https://cloudflare.com', 'https://github.com', 'invalid-url'];

consumeTechStream(MY_WORKER_URL, urls);

```

**Event Structure:**

The SSE stream sends JSON objects prefixed with `data: ` and separated by `\n\n`. Each object has a `type` field:

*   `{ "type": "url_processing", "url": "..." }`: Indicates processing has started for a URL.
*   `{ "type": "tech_detected", "url": "...", "tech": { "name": "...", "categories": [...] } }`: Sent for each technology detected on the URL.
*   `{ "type": "url_completed", "url": "..." }`: Indicates processing finished successfully for a URL.
*   `{ "type": "url_error", "url": "...", "error": "..." }`: Indicates an error occurred while processing a URL.

## Using the SDK Directly with Streaming (Server-Sent Events)

While the above examples show interacting with the deployed Cloudflare worker, you can also use the `findTech` function directly within your own backend (e.g., Node.js, Express, Nuxt/Nitro) to generate a Server-Sent Event stream.

This is useful for providing real-time feedback as technologies are detected on each URL.

**Example (Nitro/Nuxt Event Handler):**

This example demonstrates how to create an SSE endpoint within a Nitro/Nuxt application using `findTech` and its `onTechDetected` callback.

```typescript
import { defineEventHandler, readBody, setResponseHeaders, createError } from 'h3';
import { findTech } from 'whats-that-tech-js-sdk';
// Import the type for the callback payload
import type { DetectedTechInfo } from 'whats-that-tech-js-sdk'; 

// Define the structure for different SSE Event types
type SSEEvent =
  | { type: 'start'; urls: string[] }
  | { type: 'url_processing'; url: string }
  | { type: 'tech_detected'; url: string; tech: DetectedTechInfo }
  | { type: 'url_completed'; url: string }
  | { type: 'url_error'; url: string; error: string }
  | { type: 'end'; }
  | { type: 'error'; message: string }; // General error

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { url, urls } = body;

  // Handle both single URL and array of URLs
  const urlsToAnalyze = urls || (url ? [url] : []);

  if (urlsToAnalyze.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'At least one URL is required'
    });
  }

  // Set headers for streaming
  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Helper to write SSE messages to the response
  const sendEvent = (data: SSEEvent) => {
    // Ensure the response stream is still writable before attempting to write
    if (!event.node.res.writableEnded) {
      event.node.res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  };

  try {
    // Send initial state
    sendEvent({ type: 'start', urls: urlsToAnalyze });

    // Process each URL sequentially for clearer streaming
    for (const urlToAnalyze of urlsToAnalyze) {
      sendEvent({ type: 'url_processing', url: urlToAnalyze });
      try {
        // Define the callback for detected technologies for *this* URL
        const handleTechDetection = (techInfo: DetectedTechInfo) => {
          sendEvent({ type: 'tech_detected', url: urlToAnalyze, tech: techInfo });
        };

        // Call findTech, passing the onTechDetected callback
        await findTech({
          url: urlToAnalyze,
          headless: true, 
          timeout: 30000,
          onTechDetected: handleTechDetection, 
        });

        // Send completion event for this URL
        sendEvent({ type: 'url_completed', url: urlToAnalyze });

      } catch (urlError) {
        console.error(`Error processing ${urlToAnalyze}:`, urlError);
        const errorMessage = urlError instanceof Error ? urlError.message : 'Unknown error';
        sendEvent({ type: 'url_error', url: urlToAnalyze, error: errorMessage });
      }
    }

    // Send completion event and end the stream
    sendEvent({ type: 'end' });
    if (!event.node.res.writableEnded) {
        event.node.res.end();
    }

  } catch (error) {
    console.error('General SSE Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process request';
    // Send a general error event if something went wrong outside the loop
    sendEvent({ type: 'error', message: errorMessage });
    if (!event.node.res.writableEnded) {
        event.node.res.end();
    }
  }
  
  // Return undefined or void for H3 event handlers when manually ending response
  return; 
});
```

**Explanation:**

1.  **Imports:** Import `defineEventHandler` and helpers from `h3`, `findTech`, and the `DetectedTechInfo` type from the SDK.
2.  **SSE Setup:** Use `setResponseHeaders` to set the `Content-Type` to `text/event-stream` and other relevant headers.
3.  **`sendEvent` Helper:** A function to format and write data to the response stream (`event.node.res`) as SSE messages (`data: ...\n\n`). Includes a check (`writableEnded`) to prevent writing to a closed stream.
4.  **Processing Loop:** Iterate through the requested URLs.
5.  **`onTechDetected` Callback:** For each URL, define a callback function (`handleTechDetection`) that takes the `DetectedTechInfo` and uses `sendEvent` to immediately stream a `tech_detected` event to the client.
6.  **`findTech` Call:** Call `findTech` with the URL and pass the `handleTechDetection` callback to the `onTechDetected` option. Other options like `timeout`, `categories`, `headless`, etc., can be included as needed.
7.  **Lifecycle Events:** Send custom events like `start`, `url_processing`, `url_completed`, `url_error`, and `end` to provide context to the client about the overall process.
8.  **Stream Termination:** Ensure `event.node.res.end()` is called when processing is complete or an unrecoverable error occurs.
9.  **Return Value:** The handler should return `undefined` or `void` as the response is handled manually via `event.node.res`.

**Consuming this Stream:**

A client consuming this endpoint would connect and listen for these events, similar to the Node.js consumer example shown previously for the Cloudflare worker, but updating the `switch` statement to handle the event types defined here (`start`, `url_processing`, `tech_detected`, `url_completed`, `url_error`, `end`, `error`).

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