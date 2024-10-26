import Head from 'next/head';

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Head>
        <title>Coming Soon</title>
        <meta name="description" content="Our website is coming soon!" />
      </Head>
      <main className="text-center">
        <h1 className="text-5xl font-bold text-gray-800">Coming Soon</h1>
        <p className="mt-4 text-lg text-gray-600">We’re working hard to bring you something amazing.</p>
        <p className="mt-2 text-md text-gray-500">Stay tuned!</p>
      </main>
    </div>
  );
};

export default ComingSoon;
