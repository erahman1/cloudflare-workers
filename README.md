Disclaimer: 



Assessing the fucntionality of CF Zero Trust by authenticating users which have been proxied via secure tunnel and examining authenticated users access (IdP has been configured prior).
Using the CF Workers capability to create an application via Wrangler CLI where idenity information is returned on authenticated user.
Flag .svg files have been imported in a R2 "flags" bucket.

The structure is as follows
/cloudflare-worker/
- wrangler.toml #config file
-- /src/index.js #script handles request including a scheduled event (CORS triggers)
