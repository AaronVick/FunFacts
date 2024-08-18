import axios from 'axios';

const FACT_API = 'https://uselessfacts.jsph.pl/random.json?language=en';
const OG_IMAGE_API = `https://funfacts-xi.vercel.app/api/generateImage`;

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
  console.log('Received request to /api/findFact');
  console.log('Request method:', req.method);
  console.log('OG_IMAGE_API:', OG_IMAGE_API);

  if (req.method === 'POST') {
    try {
      console.log('Attempting to fetch random fact...');
      const fact = await fetchRandomFact();
      
      if (fact) {
        console.log('Successfully fetched a random fact:', fact);
        
        // Generate OG image URL
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
              <meta property="fc:frame:button:1" content="Another Fact" />
              <meta property="fc:frame:post_url" content="https://funfacts-xi.vercel.app/api/findFact" />
              <meta property="fc:frame:button:2" content="Share" />
              <meta property="fc:frame:button:2:action" content="link" />
              <meta property="fc:frame:button:2:target" content="https://warpcast.com/~/compose?text=${encodeURIComponent(`Did you know? ${fact}\n\nLearn more fun facts at https://funfacts-xi.vercel.app`)}" />
            </head>
            <body>
              <h1>Fun Fact</h1>
              <p>${fact}</p>
            </body>
          </html>
        `);
      } else {
        console.log('Failed to fetch a random fact');
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Error</title>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="https://funfacts-xi.vercel.app/error.png" />
              <meta property="fc:frame:button:1" content="Try Again" />
              <meta property="fc:frame:post_url" content="https://funfacts-xi.vercel.app/api/findFact" />
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
            <meta property="fc:frame:image" content="https://funfacts-xi.vercel.app/error.png" />
            <meta property="fc:frame:button:1" content="Try Again" />
            <meta property="fc:frame:post_url" content="https://funfacts-xi.vercel.app/api/findFact" />
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
          <meta property="fc:frame:image" content="https://funfacts-xi.vercel.app/error.png" />
          <meta property="fc:frame:button:1" content="Go Back" />
          <meta property="fc:frame:post_url" content="https://funfacts-xi.vercel.app/api/findFact" />
        </head>
        <body>
          <h1>Method Not Allowed</h1>
          <p>This endpoint only accepts POST requests.</p>
        </body>
      </html>
    `);
  }
}