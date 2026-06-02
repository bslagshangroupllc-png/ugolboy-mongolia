export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const STORAGE_KEY = "ugolboy_mongolia_landing_content_v2";
  const url = process.env.KV_REST_API_URL || process.env.STORAGE_REST_API_URL || process.env.STORAGE_URL || process.env.KV_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN || process.env.STORAGE_TOKEN || process.env.KV_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_TOKEN;

  if (!url || !token) {
    return res.status(200).json({ 
      error: "Vercel KV is not configured. Please connect a KV database in the Vercel project dashboard.",
      isNotConfigured: true
    });
  }

  try {
    if (req.method === 'GET') {
      const response = await fetch(`${url}/get/${STORAGE_KEY}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      let parsedResult = null;
      if (data.result) {
        try {
          parsedResult = JSON.parse(data.result);
        } catch {
          parsedResult = data.result; // If it's already an object
        }
      }
      return res.status(200).json(parsedResult || {});
    } else if (req.method === 'POST') {
      const bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const response = await fetch(`${url}/set/${STORAGE_KEY}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: bodyData
      });
      const data = await response.json();
      return res.status(200).json({ success: true, result: data.result });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('KV REST API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
