import { Shopify } from '@shopify/shopify-api';

// Shopify API credentials
const API_KEY = '5cd9829ea6dc241bb8d3eefdcbad37d6';
const API_SECRET = 'c127f67eefa1b57e66c53e2329f1edb6';
const REDIRECT_URI = 'http://213.130.147.62:3000/api/auth/shopify/callback';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const { shop, code, hmac, timestamp } = Object.fromEntries(searchParams.entries());

  if (!shop || !code) {
    return new Response('Invalid request.', { status: 400 });
  }

  // Check the request is coming from Shopify
  const valid = Shopify.Auth.validateHMAC({ hmac, timestamp });
  if (!valid) {
    return new Response('Request was not valid.', { status: 400 });
  }

  // Exchange the code for the access token
  try {
    const accessToken = await Shopify.Auth.getAccessToken(code);
    // Store the access token securely for future API calls
    // You can store the token in a database along with the store's shop domain
    // Example: save access token to database for future use
    // db.saveAccessToken(shop, accessToken);
    
    return new Response('App successfully installed!');
  } catch (error) {
    console.error('Error during access token exchange:', error);
    return new Response('Error during installation process.', { status: 500 });
  }
}
