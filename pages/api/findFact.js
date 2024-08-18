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

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log('Received POST request to /api/findFact');

      const fact = await fetchRandomFact();

      if (fact) {
        const ogImageUrl = `${OG_IMAGE_API}?` + new URLSearchParams({
          text: fact
        }).toString();

        console.log('Generated OG Image URL:', ogImageUrl);

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Fun Fact</title>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${ogImageUrl}" />
              <meta property="fc:frame:button:1" content="Find Another" />
              <meta property="fc:frame:button:1:action" content="post" />
              <meta property="fc:frame:button:2" content="Share" />
              <meta property="fc:frame:button:2:action" content="compose" />
              <meta property="fc:frame:button:2:target" content="Enjoy some random fun facts. Frame by @aaronv.eth" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/findFact" />
            </head>
            <body>
              <h1>Fun Fact</h1>
              <p>${fact}</p>
            </body>
          </html>
        `);
      } else {
        console.log('Failed to fetch a fun fact');
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Error</title>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/error.png" />
              <meta property="fc:frame:button:1" content="Try Again" />
              <meta property="fc:frame:button:1:action" content="post" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/findFact" />
            </head>
            <body>
              <h1>Error</h1>
              <p>Sorry, we couldn't fetch a fun fact. Please try again!</p>
            </body>
          </html>
        `);
      }
    } catch (error) {
      console.error('Error in findFact handler:', error);
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Error</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/error.png" />
            <meta property="fc:frame:button:1" content="Try Again" />
            <meta property="fc:frame:button:1:action" content="post" />
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/findFact" />
          </head>
          <body>
            <h1>Error</h1>
            <p>An unexpected error occurred. Please try again!</p>
          </body>
        </html>
      `);
    }
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.status(405).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Method Not Allowed</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/error.png" />
          <meta property="fc:frame:button:1" content="Go Back" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/findFact" />
        </head>
        <body>
          <h1>Method Not Allowed</h1>
          <p>This endpoint only accepts POST requests.</p>
        </body>
      </html>
    `);
  }
}
