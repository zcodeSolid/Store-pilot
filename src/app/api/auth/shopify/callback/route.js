import crypto from 'crypto';
import axios from 'axios';
import { query as q } from 'faunadb';
import { serverClient } from '@/lib/fauna'; // Or your DB logic

export default async function handler(req, res) {
  const { shop, code, hmac, ...rest } = req.query;

  if (!shop || !code || !hmac) {
    return res.status(400).json({ error: 'Invalid request' });
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

  if (hash !== hmac) {
    return res.status(400).json({ error: 'Invalid HMAC signature' });
  }

  try {
    const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: "5cd9829ea6dc241bb8d3eefdcbad37d6",
      client_secret: secret,
      code,
    });

    const accessToken = tokenResponse.data.access_token;

    // ✅ Store to your DB (example with FaunaDB or whatever you're using)
    // await serverClient.query(
    //   q.Create(q.Collection('shops'), {
    //     data: {
    //       shop,
    //       accessToken,
    //     },
    //   })
    // );

    return `<html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopify Test Interface</title>
    <link href="https://cdn.shopify.com/s/assets/external/app.css" rel="stylesheet" type="text/css">
</head>
<body>

    <div class="ShopifyApp">
        <div class="ShopifyApp__Header">
            <h1>Shopify App Test Interface</h1>
        </div>

        <div class="ShopifyApp__Content">
            <p>Welcome to your Shopify App Interface!</p>

            <!-- Display the connected shop name -->
            <p>Your shop: <strong>whatches-theme.myshopify.com</strong></p>

            <!-- Test Message -->
            <p>This is a test view to see how your app interface looks.</p>
        </div>

        <footer>
            <p>Powered by Your App - Test</p>
        </footer>
    </div>

    <script>
        // Add any custom JS for the test interface if needed
    </script>



</body></html>`;

  } catch (err) {
    return res.status(400).json({ error: 'Failed to get access token' });
  }
}
