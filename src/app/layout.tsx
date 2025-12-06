import type { Metadata } from 'next';
import '../app/globals.css';
import Providers from './providers';

export const metadata: Metadata = {
    title: 'Cafe Lua',
    description: 'Next.js + shadcn migration scaffold for Cafe Lua'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
