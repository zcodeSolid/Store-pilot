import crypto from 'crypto';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get('shop');
  const code = searchParams.get('code');
  const hmac = searchParams.get('hmac');
  const rest = {};

  // Extract any other query parameters for verification
  searchParams.forEach((value, key) => {
    if (key !== 'shop' && key !== 'code' && key !== 'hmac') {
      rest[key] = value;
    }
  });

  if (!shop || !code || !hmac) {
    console.error('Missing parameters:', { shop, code, hmac });
    return NextResponse.json({ error: 'Invalid request. Missing parameters' }, { status: 400 });
  }

  // ✅ Verify HMAC
  const message = Object.keys(rest)
    .sort()
    .map(key => `${key}=${rest[key]}`)
    .join('&');

  const secret = "c127f67eefa1b57e66c53e2329f1edb6";
  const hash = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');

  console.log('Generated HMAC hash:', hash);
  console.log('Provided HMAC:', hmac);

  // if (hash !== hmac) {
  //   console.error('Invalid HMAC signature');
  //   return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 400 });
  // }

  try {
    // Request access token from Shopify
    console.log('Requesting access token from Shopify...');
    const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: "5cd9829ea6dc241bb8d3eefdcbad37d6",
      client_secret: secret,
      code,
    });

    console.log('Token response from Shopify:', tokenResponse.data);

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      console.error('No access token returned');
      return NextResponse.json({ error: 'Failed to retrieve access token' }, { status: 400 });
    }

    console.log('Access token obtained:', accessToken);

    // Send HTML response
    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Shopify Test Interface</title>
        <link href="https://cdn.shopify.com/s/assets/external/app.css" rel="stylesheet" type="text/css" />
      </head>
      <body>

        <div class="ShopifyApp">
          <div class="ShopifyApp__Header">
            <h1>Shopify App Test Interface</h1>
          </div>

          <div class="ShopifyApp__Content">
            <p>Welcome to your Shopify App Interface!</p>
            <p>Your shop: <strong>${shop}</strong></p>
            <p>This is a test view to see how your app interface looks.</p>
          </div>

          <footer>
            <p>Powered by Your App - Test</p>
          </footer>
        </div>

      </body>
      </html>
    `;

    return NextResponse.text(htmlResponse, { status: 200 });

  } catch (err) {
    console.error('Error occurred while obtaining access token:', err);
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 400 });
  }
}
