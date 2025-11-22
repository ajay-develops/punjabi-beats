import './globals.css';
import { PropsWithChildren } from 'react';
import { Figtree } from 'next/font/google';

import SupabaseProvider from '@/providers/SupabaseProvider';
import UrqlProvider from '@/providers/UrqlProvider';
import ToasterProvider from '@/providers/ToasterProvider';
import UserProvider from '@/providers/UserProvider';
import ModalProvider from '@/providers/ModalProvider';
import getSongsByUserId from '@/actions/getSongsByUserId';

import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';

const font = Figtree({ subsets: ['latin'] });

export const metadata = {
  title: 'Punjabi Beats',
  description: 'Listen to Music',
  icons: {
    icon: '/images/punjabi-beats-logo.png',
    apple: '/images/punjabi-beats-logo.png',
  },
};

export const revalidate = 0;

interface RootLayoutProps extends PropsWithChildren {}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const userSongs = await getSongsByUserId();

  return (
    <html lang='en'>
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UrqlProvider>
            <UserProvider>
              <ModalProvider />
              <Sidebar songs={userSongs}>{children}</Sidebar>
              <Player />
            </UserProvider>
          </UrqlProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
};

export default RootLayout;
