/// <reference types="@cloudflare/workers-types" />
import { findTech } from '../../src/cloudflare';

// Define the environment interface for Cloudflare Workers
interface Env {
  MYBROWSER: any; // Cloudflare's browser binding
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

      // Only allow GET requests
      if (request.method !== 'GET') {
        return new Response('Method not allowed', { 
          status: 405,
          headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // Get URL from query parameter
      const url = new URL(request.url);
      const targetUrl = url.searchParams.get('url');
      
      if (!targetUrl) {
        return new Response('Please provide a URL parameter', { 
          status: 400,
          headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      console.log('Processing URL:', targetUrl);
      
      // Run technology detection
      const results = await findTech({
        url: targetUrl,
        timeout: 30000
      }, env);

      console.log('Detection completed:', results);

      // Return results as JSON
      return new Response(JSON.stringify(results, null, 2), {
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