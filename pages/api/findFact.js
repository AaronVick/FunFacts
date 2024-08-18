import axios from 'axios';

export const config = {
  runtime: 'edge',
};

const FACT_API = 'https://uselessfacts.jsph.pl/random.json?language=en';
const OG_IMAGE_API = `${process.env.NEXT_PUBLIC_BASE_URL}/api/generateImage`;

async function fetchRandomFact() {
  try {
    const response = await axios.get(FACT_API);
    if (response.status === 200) {
      return response.data.text;
    } else {
      throw new Error('Failed to fetch fact');
    }
  } catch (error) {
    console.error('Error fetching random fact:', error);
    return null;
  }
}

export default async function handler(req) {
  if (req.method === 'POST') {
    try {
      console.log('Received POST request to /api/findFact');

      const fact = await fetchRandomFact();

      if (fact) {
        const ogImageUrl = `${OG_IMAGE_API}?` + new URLSearchParams({
          text: fact
        }).toString();

        console.log('Generated OG Image URL:', ogImageUrl);

        return new Response(
          `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Fun Fact</title>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${ogImageUrl}" />
              <meta property="fc:frame:button:1" content="Find Another" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/findFact" />
              <meta property="fc:frame:button:2" content="Share" />
              <meta property="fc:frame:button:2:action" content="link" />
              <meta property="fc:frame:button:2:target" content="https://warpcast.com/~/compose?text=I%20just%20learned%20this%20fun%20fact%3A%20${encodeURIComponent(fact)}%0A%0ALearn%20more%20fun%20facts%20at%20https%3A%2F%2Ffunfacts-xi.vercel.app%2F" />
            </head>
            <body>
              <h1>Fun Fact</h1>
              <p>${fact}</p>
            </body>
          </html>
        `,
          {
            status: 200,
            headers: {
              'Content-Type': 'text/html',
            },
          }
        );
      } else {
        console.log('Failed to fetch a fun fact');
        return new Response(
          `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Error</title>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/error.png" />
              <meta property="fc:frame:button:1" content="Try Again" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/findFact" />
            </head>
            <body>
              <h1>Error</h1>
              <p>Sorry, we couldn't fetch a fun fact. Please try again!</p>
            </body>
          </html>
        `,
          {
            status: 200,
            headers: {
              'Content-Type': 'text/html',
            },
          }
        );
      }
    } catch (error) {
      console.error('Error in findFact handler:', error);
      return new Response(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Error</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/error.png" />
            <meta property="fc:frame:button:1" content="Try Again" />
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/findFact" />
          </head>
          <body>
            <h1>Error</h1>
            <p>An unexpected error occurred. Please try again!</p>
          </body>
        </html>
      `,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }
  } else {
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Method Not Allowed</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/error.png" />
          <meta property="fc:frame:button:1" content="Go Back" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/findFact" />
        </head>
        <body>
          <h1>Method Not Allowed</h1>
          <p>This endpoint only accepts POST requests.</p>
        </body>
      </html>
    `,
      {
        status: 405,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
}