import { promises as fs } from 'fs';
import axios from 'axios';
import path from 'path';
import { ImageResponse } from '@vercel/og';

const FACT_API = 'https://uselessfacts.jsph.pl/random.json?language=en';

export const config = {
  runtime: 'edge',
};

function getRandomColor() {
  const colors = ['#2C2C2C', '#1F1F1F', '#3D3D3D', '#4A4A4A', '#5A5A5A'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log('Fetching random fact...');
      const factResponse = await axios.get(FACT_API);
      const fact = factResponse.data.text;
      console.log('Fetched fact:', fact);

      // Generate the image
      const backgroundColor = getRandomColor();
      const imageBuffer = new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              width: '1200px',
              height: '630px',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: backgroundColor,
              color: '#FFFFFF',
              fontFamily: 'Arial, sans-serif',
              fontSize: '50px',
              textAlign: 'center',
              padding: '50px',
            }}
          >
            {fact}
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );

      // Save the image to the public directory
      const imagePath = path.join(process.cwd(), 'public', 'funfact.png');
      await fs.writeFile(imagePath, Buffer.from(imageBuffer));

      console.log('Image saved to:', imagePath);

      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Random Fun Fact</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="/funfact.png" />
            <meta property="fc:frame:button:1" content="Find Another" />
            <meta property="fc:frame:button:1:action" content="post" />
            <meta property="fc:frame:post_url" content="/api/findFact" />
            <meta property="fc:frame:button:2" content="Share" />
            <meta property="fc:frame:button:2:action" content="compose" />
            <meta property="fc:frame:compose_text" content="Enjoy some random fun facts. Frame by @aaronv.eth" />
          </head>
          <body>
            <h1>Random Fun Fact</h1>
            <p>Check out this fun fact!</p>
          </body>
        </html>
      `);

    } catch (error) {
      console.error('Error generating fun fact:', error);
      res.status(500).send('Error generating fun fact');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
