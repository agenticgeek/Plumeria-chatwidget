const N8N_WEBHOOK_URL =
  'https://tca-wireless.app.n8n.cloud/webhook/239ddf17-73e7-43f8-99ff-ce8f232e476c';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const upstream = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(25000),
    });

    const contentType = upstream.headers.get('content-type') || 'text/plain';
    const body = await upstream.text();

    res.setHeader('Content-Type', contentType);
    return res.status(upstream.status).send(body);
  } catch (err) {
    console.error('Proxy error:', err);
    return res
      .status(502)
      .json({ error: 'Unable to reach the booking assistant. Please try again shortly.' });
  }
}
