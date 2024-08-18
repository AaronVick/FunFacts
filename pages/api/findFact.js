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

        const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/findFact?${new URLSearchParams({
          fact,
          color: backgroundColor,
        }).toString()}`;

        return new Response(
          `<!DOCTYPE html>
          <html>
            <head>
              <title>Random Fun Fact</title>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${ogImageUrl}" />
              <meta property="fc:frame:button:1" content="Find Another" />
              <meta property="fc:frame:button:1:action" content="post" />
              <meta property="fc:frame:button:2" content="Share" />
              <meta property="fc:frame:button:2:action" content="link" />
              <meta property="fc:frame:button:2:target" content="https://warpcast.com/compose?text=Enjoy some random fun facts. Frame by @aaronv.eth" />
            </head>
            <body>
              <h1>Fun Fact</h1>
              <p>Here’s your random fun fact: "${fact}"</p>
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
      const ogImageUrl = placeholderImage;

      return new Response(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Error</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${ogImageUrl}" />
            <meta property="fc:frame:button:1" content="Try Again" />
            <meta property="fc:frame:button:1:action" content="post" />
            <meta property="fc:frame:button:2" content="Share" />
            <meta property="fc:frame:button:2:action" content="link" />
            <meta property="fc:frame:button:2:target" content="https://warpcast.com/compose?text=Enjoy some random fun facts. Frame by @aaronv.eth" />
          </head>
          <body>
            <h1>Error</h1>
            <p>An unexpected error occurred. Here’s a fun image instead!</p>
            <img src="${ogImageUrl}" alt="Placeholder Image" style="max-width: 100%; height: auto;" />
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
          <title>Method Not Allowed</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/error.png" />
          <meta property="fc:frame:button:1" content="Go Back" />
          <meta property="fc:frame:button:1:action" content="post" />
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
