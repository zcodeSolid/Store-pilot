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

  if (hash !== hmac) {
    console.error('Invalid HMAC signature');
    console.log({ error: 'Invalid HMAC signature' }, { status: 400 });
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
      // NextResponse.json({ error: 'Failed to retrieve access token' }, { status: 400 })
      console.log({ error: 'Failed to retrieve access token' }, { status: 400 });
    }

    console.log('Access token obtained:', accessToken);

    const response = NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_APP_URL}dashboard`, req.url));
    response.cookies.set('token', 'your-secret-token', {
      httpOnly: true,
      path: process.env.NEXT_PUBLIC_APP_URL,
      secure: true,
      sameSite: 'lax',
    });

    return response;

  } catch (err) {
    console.error('Error occurred while obtaining access token:', err);
    return NextResponse.json({ error: 'Failed to get access token 54535' }, { status: 400 });
  }
}
