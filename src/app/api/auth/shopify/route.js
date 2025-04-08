export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use GET.' });
  }

  // Extract the shop parameter from the query
  const { shop } = req.query;

  // If the shop parameter is not provided, return a 400 error
  if (!shop) {
    return res.status(400).json({ error: 'No shop provided' });
  }

  // Shopify OAuth details
  const apiKey = "5cd9829ea6dc241bb8d3eefdcbad37d6";
  const scopes = "read_products,write_products";
  const redirectUri = "https://storepilot.zcode.site/api/auth/shopify/callback";

  // Construct the Shopify OAuth URL
  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}`;

  // Redirect the user to the Shopify OAuth authorization page
  res.redirect(installUrl);
}
