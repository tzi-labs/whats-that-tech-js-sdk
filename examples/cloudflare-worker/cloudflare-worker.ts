/// <reference types="@cloudflare/workers-types" />
import { findTech } from '../../src/cloudflare';
// Import the necessary type from the core module
import type { DetectedTechInfo } from '../../src/cloudflare';

// Define the environment interface for Cloudflare Workers
interface Env {
  MYBROWSER: any; // Cloudflare's browser binding
}

// Define types for batch processing
interface BatchRequest {
  urls: string[];
  showDetectedDetails?: boolean;
}

interface BatchResponse {
  results: {
    url: string;
    data: any;
    error?: string;
  }[];
}

// Define the structure for different SSE Event types
type SSEEvent =
  | { type: 'url_processing'; url: string }
  | { type: 'tech_detected'; url: string; tech: DetectedTechInfo }
  | { type: 'url_completed'; url: string }
  | { type: 'url_error'; url: string; error: string };

// Define the handler type for Cloudflare Workers
interface Handler {
  fetch(request: Request, env: Env): Promise<Response>;
}

// Export the handler
const handler: Handler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      // Check if browser binding is available
      if (!env.MYBROWSER) {
        return new Response(JSON.stringify({ 
          error: 'Browser binding not available. Please check your Cloudflare Worker configuration.' 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // Handle CORS preflight requests
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      // Check if client accepts SSE
      const acceptHeader = request.headers.get('Accept');
      const wantsSSE = acceptHeader && acceptHeader.includes('text/event-stream');

      // Process URLs based on request method
      let urls: string[] = [];
      let showDetectedDetails = false;
      
      if (request.method === 'GET') {
        // For GET requests, support both single URL and comma-separated URLs
        const url = new URL(request.url);
        const targetUrl = url.searchParams.get('url');
        showDetectedDetails = url.searchParams.get('showDetectedDetails') === 'true';
        
        if (!targetUrl) {
          return new Response('Please provide a URL parameter', { 
            status: 400,
            headers: {
              'Content-Type': 'text/plain',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }

        urls = targetUrl.split(',').map(url => url.trim());
      } else if (request.method === 'POST') {
        // For POST requests, expect a JSON body with an array of URLs
        const contentType = request.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return new Response('Content-Type must be application/json', {
            status: 400,
            headers: {
              'Content-Type': 'text/plain',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }

        const body = await request.json() as BatchRequest;
        if (!body.urls || !Array.isArray(body.urls)) {
          return new Response('Request body must contain a "urls" array', {
            status: 400,
            headers: {
              'Content-Type': 'text/plain',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }

        urls = body.urls;
        showDetectedDetails = body.showDetectedDetails || false;
      } else {
        return new Response('Method not allowed', { 
          status: 405,
          headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // Validate URL count limits
      if (request.method === 'GET' && urls.length > 1) {
        return new Response('GET requests support only one URL', {
          status: 400,
          headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      if (request.method === 'POST' && urls.length > 8) {
        return new Response('POST requests support up to 8 URLs', {
          status: 400,
          headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // If SSE is requested, handle streaming
      if (wantsSSE) {
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const encoder = new TextEncoder();

        // Updated function to write typed SSE events
        const writeSSE = (event: SSEEvent) => {
          writer.write(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        };

        // Process URLs sequentially and stream results
        (async () => {
          for (const url of urls) {
            writeSSE({ type: 'url_processing', url });
            try {
              // Define the callback for detected technologies
              const handleTechDetection = (techInfo: DetectedTechInfo) => {
                writeSSE({ type: 'tech_detected', url, tech: techInfo });
              };

              // Call findTech, passing the callback. No return value expected.
              await findTech({
                url,
                timeout: 30000,
                customFingerprintsFile: 'https://raw.githubusercontent.com/tzi-labs/whats-that-tech-js-sdk/refs/heads/main/dist/core.json',
                onTechDetected: handleTechDetection // Pass the callback
              }, env);

              // Signal completion for this URL
              writeSSE({ type: 'url_completed', url });
            } catch (error) {
              console.error(`Error processing ${url}:`, error);
              const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
              // Signal error for this URL
              writeSSE({ type: 'url_error', url, error: errorMessage });
            }
          }
          // Close the stream when done
          await writer.close();
        })(); // IIFE to run the async processing

        // Return the streaming response
        return new Response(readable, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*' // Adjust CORS as needed
          }
        });

      } else {
        // Existing logic for batch JSON response
        const results = await Promise.all(urls.map(async (url) => {
          try {
            // NOTE: The batch response part now won't get individual tech data
            // because findTech returns void. It will only signal success/failure per URL.
            // Consider removing or adapting this non-SSE path if fine-grained data is always needed.
            console.log('Processing URL:', url);
            await findTech({
              url,
              timeout: 30000,
              customFingerprintsFile: 'https://raw.githubusercontent.com/tzi-labs/whats-that-tech-js-sdk/refs/heads/main/dist/core.json'
            }, env);
            
            // Since findTech is void, we just return success marker
            return {
              url,
              data: { status: 'Processed (check SSE for details if requested)' }
            };
          } catch (error) {
            return {
              url,
              error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
          }
        }));

        // Return results as JSON
        return new Response(JSON.stringify({ results }, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    } catch (error) {
      console.error('Error in worker:', error);
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        stack: error instanceof Error ? error.stack : undefined
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};

export default handler; 