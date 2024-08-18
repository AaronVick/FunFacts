import { ImageResponse } from '@vercel/og';
import axios from 'axios';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const { data } = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
    const fact = data.text || 'Here is your random fun fact!';

    const colors = ['#1a1a1a', '#2c2c2c', '#3d3d3d', '#4e4e4e', '#5f5f5f'];
    const backgroundColor = colors[Math.floor(Math.random() * colors.length)];

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
            padding: '40px',
            backgroundColor: backgroundColor,
            fontFamily: 'Arial, sans-serif',
            fontSize: '36px',
            color: '#ffffff',
            textAlign: 'center',
          }}
        >
          <p>{fact}</p>
        </div>
      ),
      {
        width: 1200,
        height: 630, // 1.91:1 aspect ratio
      }
    );
  } catch (error) {
    console.error('Error generating fun fact image:', error);
    return new Response('Error generating fun fact image', { status: 500 });
  }
}
