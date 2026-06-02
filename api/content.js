import Redis from 'ioredis';

let redis = null;

function getRedisClient() {
  if (!redis && process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL);
  }
  return redis;
}

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

  const client = getRedisClient();

  if (!client) {
    return res.status(200).json({ 
      error: "Vercel Redis is not configured. Please connect a Redis database in the Vercel project dashboard.",
      isNotConfigured: true
    });
  }

  const STORAGE_KEY = "ugolboy_mongolia_landing_content_v2";

  try {
    if (req.method === 'GET') {
      const data = await client.get(STORAGE_KEY);
      
      let parsedResult = null;
      if (data) {
        try {
          parsedResult = JSON.parse(data);
        } catch {
          parsedResult = data;
        }
      }
      return res.status(200).json(parsedResult || {});
    } else if (req.method === 'POST') {
      const bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      await client.set(STORAGE_KEY, bodyData);
      return res.status(200).json({ success: true });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Redis API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
