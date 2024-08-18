import Head from 'next/head';

export async function getServerSideProps() {
  const baseUrl = 'https://vercel.com/aarons-projects-9827ccd9/funfacts'; // Update with your actual base URL
  console.log('Base URL for initial frame:', baseUrl);
  return { props: { baseUrl } };
}

export default function Home({ baseUrl }) {
  return (
    <>
      <Head>
        <title>Grab a Fun Fact</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${baseUrl}/funfacts.png`} />
        <meta property="fc:frame:button:1" content="Grab a Fun Fact" />
        <meta property="fc:frame:post_url" content={`${baseUrl}/api/findFact`} />
      </Head>
      <main>
        <h1>Fun Facts</h1>
      </main>
    </>
  );
}
