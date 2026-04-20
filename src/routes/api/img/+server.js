/**
 * Image proxy — fetches images from external sources (Instagram, etc.)
 * server-side to avoid hotlink blocking and CORS issues.
 *
 * Usage: /api/img?url=https://scontent.cdninstagram.com/...
 *
 * Only allows image content types. Caches for 1 hour.
 */

const ALLOWED_HOSTS = [
  'scontent.cdninstagram.com',
  'scontent-',           // scontent-iad3-1.cdninstagram.com etc.
  'instagram.com',
  'fbcdn.net',           // Facebook CDN (Instagram uses this too)
  'googleusercontent.com',
  'lh3.googleusercontent.com',
  'maps.googleapis.com',
  'yelp.com',
  'yelpcdn.com',
  's3-media',            // Yelp S3 buckets
];

function isAllowedHost(hostname) {
  return ALLOWED_HOSTS.some(h => hostname.includes(h));
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ url }) {
  const imageUrl = url.searchParams.get('url');

  if (!imageUrl) {
    return new Response('Missing ?url= parameter', { status: 400 });
  }

  let parsed;
  try {
    parsed = new URL(imageUrl);
  } catch {
    return new Response('Invalid URL', { status: 400 });
  }

  if (!isAllowedHost(parsed.hostname)) {
    return new Response(`Host not allowed: ${parsed.hostname}`, { status: 403 });
  }

  try {
    const upstream = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8',
        'Referer': parsed.origin,
      },
    });

    if (!upstream.ok) {
      return new Response(`Upstream returned ${upstream.status}`, { status: upstream.status });
    }

    const contentType = upstream.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return new Response('Not an image', { status: 400 });
    }

    const body = await upstream.arrayBuffer();

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(`Proxy error: ${err.message}`, { status: 502 });
  }
}
