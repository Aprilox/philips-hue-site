import { NextResponse } from 'next/server'
import https from 'https';

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
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ip = searchParams.get('ip')

  if (!ip) {
    return NextResponse.json({ error: 'IP du bridge non fournie' }, { status: 400 })
  }

  try {
    const response = await customFetch(`https://${ip}/api`, {
      method: 'POST',
      body: JSON.stringify({
        devicetype: 'next_hue_app#instance1',
        generateclientkey: true,
      }),
    })

    const data = await response.json()

    if (data[0].success) {
      return NextResponse.json({
        success: true,
        username: data[0].success.username,
        clientkey: data[0].success.clientkey,
      })
    } else {
      return NextResponse.json({ success: false })
    }
  } catch (error) {
    console.error('Erreur lors de la connexion au bridge:', error)
    return NextResponse.json({ error: 'Erreur lors de la connexion au bridge' }, { status: 500 })
  }
}

