import { Shopify } from '@shopify/shopify-api';

// Shopify API credentials
const API_KEY = '5cd9829ea6dc241bb8d3eefdcbad37d6';
const API_SECRET = 'c127f67eefa1b57e66c53e2329f1edb6';
const SCOPES = ['read_products', 'write_products']; 
const REDIRECT_URI = 'http://213.130.147.62:3000/api/auth/shopify/callback'; // Callback URL

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get('shop');

  if (!shop) {
    return new Response('Shop parameter is missing.', { status: 400 });
  }

  const shopify = new Shopify.Clients.Rest(shop, API_KEY, API_SECRET);

  // Generate the authorization URL for Shopify OAuth flow
  const installUrl = shopify.auth.buildAuthURL(SCOPES, REDIRECT_URI);

  // Redirect the store owner to Shopify's OAuth flow
  return Response.redirect(installUrl);
}
