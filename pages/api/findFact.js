import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    console.log('Generating fun fact image');

    // Example fun fact text (you'll replace this with your actual fact-fetching logic)
    const funFact = "Did you know? Honey never spoils! Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.";

    // Generate a random dark color for the background
    const colors = ['#2c3e50', '#34495e', '#1abc9c', '#16a085', '#27ae60', '#2980b9'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: randomColor,
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '50px', fontWeight: 'bold', marginBottom: '20px' }}>
            Fun Fact
          </div>
          <div style={{ fontSize: '30px', lineHeight: '1.5' }}>
            {funFact}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630, // 1.91:1 aspect ratio
      }
    );

  } catch (error) {
    console.error('Error generating fun fact:', error);
    return new Response('Error generating fun fact', { status: 500 });
  }
}
