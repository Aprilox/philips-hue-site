import { NextResponse } from 'next/server'
import https from 'https'

const customFetch = (url: string, options: any) => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { ...options, rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ json: () => JSON.parse(data) });
      });
    });
    req.on('error', reject);
    req.end();
  });
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ip = searchParams.get('ip')
  const username = request.headers.get('hue-application-key')

  if (!ip || !username) {
    return NextResponse.json({ error: 'IP du bridge ou username non fourni' }, { status: 400 })
  }

  try {
    const response = await customFetch(`https://${ip}/clip/v2/resource/device`, {
      headers: {
        'hue-application-key': username,
      },
    }) as any;

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur lors de la récupération des lampes:', error)
    return NextResponse.json({ error: 'Erreur lors de la récupération des lampes' }, { status: 500 })
  }
}

