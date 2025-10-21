import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple serverless proxy for Freesound using client credentials.
// Expects environment variables:
// FREESOUND_CLIENT_ID and FREESOUND_CLIENT_SECRET

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(clientId: string, clientSecret: string) {
  if (cachedToken && Date.now() < tokenExpiry - 60000) return cachedToken;

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'client_credentials');

  const resp = await fetch('https://freesound.org/apiv2/oauth2/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to get Freesound token: ${resp.status} ${text}`);
  }

  const json = await resp.json();
  cachedToken = json.access_token;
  tokenExpiry = Date.now() + (json.expires_in || 3600) * 1000;
  return cachedToken;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const theme = (req.query.theme as string) || (req.query.q as string) || 'ambient';

  const clientId = process.env.FREESOUND_CLIENT_ID;
  const clientSecret = process.env.FREESOUND_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'FREESOUND_CLIENT_ID and FREESOUND_CLIENT_SECRET must be set' });
  }

  try {
    const token = await getAccessToken(clientId, clientSecret);
    // Map theme to search query keywords
    const map: Record<string, string> = {
      forest: 'forest ambience',
      beach: 'ocean waves',
      ruins: 'wind ambience ruins',
      city: 'city street ambience',
      ambient: 'ambient',
    };

    const q = encodeURIComponent(map[theme] || theme);
    const url = `https://freesound.org/apiv2/search/text/?query=${q}&fields=previews,previews.preview-hq-mp3,previews.preview-lq-mp3&filter=duration:[0 TO 120]&page_size=10`;

    const searchRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!searchRes.ok) {
      const txt = await searchRes.text();
      return res.status(502).json({ error: 'Freesound search failed', details: txt });
    }

    const data = await searchRes.json();
    const previews: string[] = [];

    (data.results || []).forEach((r: any) => {
      if (r.previews) {
        // prefer hq mp3
        if (r.previews['preview-hq-mp3']) previews.push(r.previews['preview-hq-mp3']);
        else if (r.previews['preview-lq-mp3']) previews.push(r.previews['preview-lq-mp3']);
        else {
          // push any available preview
          const vals = Object.values(r.previews || {});
          if (vals.length) previews.push(vals[0] as string);
        }
      }
    });

    return res.json({ previews });
  } catch (err: any) {
    console.error('Freesound proxy error:', err);
    return res.status(500).json({ error: 'proxy_error', message: err.message || String(err) });
  }
}
