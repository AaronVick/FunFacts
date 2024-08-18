import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const placeholderImages = [
  'https://placekitten.com/1200/630',
  'https://placedog.net/1200/630',
  'https://baconmockup.com/1200/630',
  'https://placebear.com/1200/630'
];

async function fetchRandomFact() {
  try {
    const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
    if (!response.ok) {
      throw new Error('Failed to fetch fact');
    }
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error fetching random fact:', error);
    return null;
  }
}

function getRandomDarkColor() {
  const colors = ['#2C3E50', '#34495E', '#8E44AD', '#2980B9', '#2ECC71', '#F39C12'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomPlaceholderImage() {
  return placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
}

export default async function handler(req) {
  if (req.method === 'POST') {
    try {
      console.log('Received POST request to /api/findFact');

      const fact = await fetchRandomFact();

      if (fact) {
        console.log('Fetched random fact:', fact);

        const backgroundColor = getRandomDarkColor();

        return new Response(
          `<!DOCTYPE html>
          <html>
            <head>
              <meta name="fc:frame" content="vNext" />
              <meta name="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/findFact" />
              <meta name="fc:frame:button:1" content="Find Another" />
              <meta name="fc:frame:button:1:action" content="post" />
              <meta name="fc:frame:button:2" content="Share" />
              <meta name="fc:frame:button:2:action" content="https://warpcast.com/compose?text=Enjoy%20some%20random%20fun%20facts.%20Frame%20by%20@aaronv.eth" />
            </head>
            <body>
              <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; width:100%; height:100%; background-color:${backgroundColor}; color:white; font-size:48px; font-weight:bold; padding:20px; text-align:center;">
                ${fact}
              </div>
            </body>
          </html>`,
          {
            headers: {
              'Content-Type': 'text/html',
            },
          }
        );
      } else {
        throw new Error('Failed to fetch a valid fact');
      }
    } catch (error) {
      console.error('Error generating fun fact:', error);

      const placeholderImage = getRandomPlaceholderImage();

      return new Response(
        `<!DOCTYPE html>
        <html>
          <head>
            <meta name="fc:frame" content="vNext" />
            <meta name="fc:frame:image" content="${placeholderImage}" />
            <meta name="fc:frame:button:1" content="Go Back" />
            <meta name="fc:frame:button:1:action" content="post" />
          </head>
          <body>
            <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; width:100%; height:100%; background-color:#2C3E50; color:white; font-size:24px; font-weight:bold; padding:20px; text-align:center;">
              <img src="${placeholderImage}" alt="Placeholder" style="width:100%; height:auto;" />
              <p>An unexpected error occurred. Here’s a fun image instead!</p>
            </div>
          </body>
        </html>`,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }
  } else {
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/error.png" />
          <meta name="fc:frame:button:1" content="Go Back" />
          <meta name="fc:frame:button:1:action" content="post" />
        </head>
        <body>
          <h1>Method Not Allowed</h1>
          <p>This endpoint only accepts POST requests.</p>
        </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
}
