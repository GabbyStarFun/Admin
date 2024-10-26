import ClientWrapper from "@/components/Wrapper";
import './globals.css';

export const metadata = {
  title: 'Lime Radio',
  description: 'Listern to the best hits here at Lime radio',
  keywords: ['Radio',"Music",`Online Music`],
  openGraph: {
    title: 'Lime Radio',
    description: 'Listern to the best hits here at Lime radio',
    url: 'https://www.limeradio.net',
    images: [
      {
        url: '/favicon.ico',
        width: 256,
        height: 256,
        alt: 'Favicon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lime Radio',
    description: 'Listern to the best hits here at Lime radio',
    images: ['/favicon.ico'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
