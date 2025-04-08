import crypto from 'crypto';
import axios from 'axios';

export default async function handler(req, res) {
  const { shop, code, hmac, ...rest } = req.query;

  if (!shop || !code || !hmac) {
    console.error('Missing parameters:', { shop, code, hmac });
    return res.status(400).json({ error: 'Invalid request. Missing parameters' });
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

  if (hash !== hmac) {
    console.error('Invalid HMAC signature');
    return res.status(400).json({ error: 'Invalid HMAC signature' });
  }

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
      return res.status(400).json({ error: 'Failed to retrieve access token' });
    }

    console.log('Access token obtained:', accessToken);

    // Send HTML response
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
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
    `);

  } catch (err) {
    console.error('Error occurred while obtaining access token:', err);
    return res.status(400).json({ error: 'Failed to get access token' });
  }
}
