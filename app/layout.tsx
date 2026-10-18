import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Ceylon DayOuts - Sri Lanka Accommodations & Dayouts',
  description: "Sri Lanka's premier accommodation and dayout booking platform for short stays, villas, cabanas, and staycation experiences.",
  openGraph: {
    title: 'Ceylon DayOuts - Sri Lanka Accommodations & Dayouts',
    description: "Sri Lanka's premier accommodation and dayout booking platform for short stays, villas, cabanas, and staycation experiences.",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
