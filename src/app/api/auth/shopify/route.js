import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get('shop');

  // If no shop is provided in the query, return an error
  if (!shop) {
    return NextResponse.json({ error: 'No shop provided' }, { status: 400 });
  }

  // Shopify OAuth details
  const apiKey = "5cd9829ea6dc241bb8d3eefdcbad37d6";
  const scopes = "read_products,write_products";
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}api/auth/shopify/callback`;

  // Construct the Shopify OAuth URL
  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}`;

  // Redirect the user to the Shopify OAuth authorization page
  return NextResponse.redirect(installUrl);
}
