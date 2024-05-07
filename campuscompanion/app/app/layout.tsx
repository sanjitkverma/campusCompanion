import type { ReactNode } from 'react';
import Head from 'next/head'; // Import the Head component
import { Inter } from 'next/font/google';
import './globals.css';

// Assuming you have defined the Metadata type somewhere in your project
interface Metadata {
  title: string;
  description: string;
}

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Campus Companion',
  description: 'Campus Companion 2024',
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" /> {/* Link to your favicon here */}
      </Head>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </>
  );
};

export default RootLayout;
