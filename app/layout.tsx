import type { Metadata } from 'next';
import { Fraunces, Work_Sans, IBM_Plex_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  weight: ['400', '500'],
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Studio Gallery',
  description: 'Original paintings, available to collect.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable} ${plexMono.variable}`}>
      <body>
        <header className="border-b border-line">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
            <Link href="/" className="font-display text-xl italic tracking-tight text-ink">
              Studio Gallery
            </Link>
            <nav className="placard flex gap-6">
              <Link href="/#collection" className="hover:text-ink">Collection</Link>
              <Link href="/#about" className="hover:text-ink">About</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <p className="placard text-ink-soft">
              &copy; {new Date().getFullYear()} Studio Gallery — Original works, shipped worldwide
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
