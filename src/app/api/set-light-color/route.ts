import { NextResponse } from 'next/server'
import https from 'https'

const customFetch = (url: string, options: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { ...options, rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('Raw response:', data);
        if (res.headers['content-type']?.includes('application/json')) {
          try {
            const jsonData = JSON.parse(data);
            resolve({ json: () => jsonData, status: res.statusCode, headers: res.headers });
          } catch (error) {
            console.error('Error parsing JSON:', error);
            reject(new Error(`Invalid JSON response: ${data}`));
          }
        } else {
          console.error('Unexpected content type:', res.headers['content-type']);
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });
    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
};

export async function PUT(request: Request) {
  console.log('Received PUT request to set-light-color')
  const { searchParams } = new URL(request.url)
  const ip = searchParams.get('ip')
  const username = request.headers.get('hue-application-key')

  if (!ip || !username) {
    console.error('Missing IP or username')
    return NextResponse.json({ error: 'IP du bridge ou username non fourni' }, { status: 400 })
  }

  try {
    const { lightId, color, brightness, on } = await request.json()
    console.log('Request body:', { lightId, color, brightness, on })

    const url = `https://${ip}/clip/v2/resource/light/${lightId}`
    let body

    if (on) {
      body = JSON.stringify({
        on: { on: true },
        dimming: { brightness: Math.min(Math.max(Math.round(brightness), 0), 100) },
        color: { 
          xy: { 
            x: Math.min(Math.max(color.xy.x, 0), 1),
            y: Math.min(Math.max(color.xy.y, 0), 1)
          } 
        },
      })
    } else {
      body = JSON.stringify({
        on: { on: false }
      })
    }

    console.log('Sending request to Philips Hue bridge:', { url, body })

    const response = await customFetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'hue-application-key': username,
      },
      body: body,
    })

    console.log('Response from Philips Hue bridge:', response)

    if (response.status >= 400) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${JSON.stringify(response.json())}`)
    }

    return NextResponse.json(response.json())
  } catch (error) {
    console.error('Error in set-light-color:', error)
    return NextResponse.json({ error: 'Erreur lors du changement de couleur', details: error.message }, { status: 500 })
  }
}

