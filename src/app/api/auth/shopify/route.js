export default async function handler(req, res) {
  const { shop } = req.query;

  if (!shop) {
    return res.status(400).json({ error: 'No shop provided' });
  }

  const apiKey = "5cd9829ea6dc241bb8d3eefdcbad37d6";
  const scopes = "read_products,write_products";
  const redirectUri = "https://storepilot.zcode.site/api/auth/shopify/callback";

  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}`;

  res.redirect(installUrl);
}
