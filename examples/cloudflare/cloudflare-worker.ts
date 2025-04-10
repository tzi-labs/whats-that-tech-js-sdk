/// <reference types="@cloudflare/workers-types" />
import { findTech } from '../../src/cloudflare';

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

      // Process URLs
      const results = await Promise.all(urls.map(async (url) => {
        try {
          console.log('Processing URL:', url);
          const data = await findTech({
            url,
            timeout: 30000,
            customFingerprintsFile: 'https://raw.githubusercontent.com/tzi-labs/whats-that-tech-js-sdk/refs/heads/main/dist/core.json',
            showDetectedDetails
          }, env);
          
          return {
            url,
            data
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