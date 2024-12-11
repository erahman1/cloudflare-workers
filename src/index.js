/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// Cloudflare Worker Code
// This script handles requests at tunnel.enamur.org/secure
// and includes a scheduled event.

export default {
    // Fetch event handles incoming HTTP requests and validates /secure path
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      const path = url.pathname;
  
      // Authenticates User (Cloudflare Access Headers)
      // Extracts identity information from Cloudflare Access headers
      const EMAIL = request.headers.get("cf-access-authenticated-user-email") || 'unkown';
      const COUNTRY = request.headers.get("cf-ipcountry") || "unknown";
      const TIMESTAMP = new Date().toISOString();
  
      // Ensure the Worker responds to the `/secure` path
      if (path === "/secure/") {
        return new Response(
          `<html>
            <body>
              <p>${EMAIL} authenticated at ${TIMESTAMP} from 
              <a href="/secure/${COUNTRY}">${COUNTRY}</a></p>
            </body>
          </html>`,
          {
            headers: { "Content-Type": "text/html" },
          }
        );
      } else if (path.startsWith("/secure/")) {
        const countryCode = path.split("/")[2].toLowerCase();
        const objectKey = `${countryCode}.svg`;
  
        try {
          const object = await env.FLAGS_BUCKET.get(objectKey);
          if (!object) {
            return new Response("Flag not found", { status: 404 });
          }
  
          return new Response(object.body, {
            headers: { "Content-Type": "image/svg+xml" },
          });
        } catch (err) {
          return new Response("Error fetching flag", { status: 500 });
        }
      }
      
      // Return 404 for other paths - if /secure path does not match
      return new Response("Not Found", { status: 404 });
    },
  
    // Handle the scheduled event - scheduled event is triggered at configured intervals
    scheduled(event, env, ctx) {
      console.log("Scheduled task triggered at:", new Date().toISOString());
      console.log(event.scheduledTime);
      // Add custom logic for scheduled tasks
    },
  };
