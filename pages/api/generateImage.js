import { ImageResponse } from '@vercel/og';

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  try {
    const { text } = req.query;

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            backgroundColor: 'white',
            backgroundSize: '150px 150px',
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              color: 'black',
              marginTop: 30,
              padding: '0 120px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}
          >
            {text}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200);

    imageResponse.body.pipe(res);
  } catch (e) {
    console.log(`${e.message}`);
    res.status(500).send('Failed to generate the image');
  }
}