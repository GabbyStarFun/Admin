import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function NotFound() {
  const theme = "dark"
  const isDarkMode = theme === 'dark';

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="mb-4 text-center">Oops! It seems you've stumbled upon a page that doesn't exist.</p>
      <p className="mb-4 text-center">Please check the URL or try searching for what you're looking for.</p>
      <Link
        href="/"
        className={`px-4 py-2 rounded hover:bg-blue-600 transition-colors ${isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'}`}
      >
        Go back home
      </Link>
    </div>
  );
}