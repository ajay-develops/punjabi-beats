import Image from 'next/image';
import getSongs from '@/actions/getSongs';

import Header from '@/components/Header';
import ListItem from '@/components/ListItem';
import PageContent from '@/app/(site)/components/PageContent';
import Welcome from '@/app/(site)/components/Welcome';

export const revalidate = 0;

const Home = async () => {
  const songs = await getSongs();

  return (
    <div
      className='bg-neutral-900 rounded-lg h-full overflow-hidden overflow-y-auto 
      md:mr-2'
    >
      <Header>
        <div className='mb-2'>
          <div className='flex items-center gap-4 mb-4'>
            <div className='relative h-16 w-16 md:h-20 md:w-20'>
              <Image
                src='/images/punjabi-beats-logo.png'
                alt='Punjabi Beats Logo'
                fill
                className='object-contain'
              />
            </div>
            <Welcome />
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4'>
            <ListItem
              image='/images/liked.png'
              name='Favorites'
              href='favorites'
            />
          </div>
        </div>
      </Header>
      <div className='mt-2 mb-7 px-6'>
        <div className='flex justify-between items-center '>
          <h1 className='text-white text-2xl font-semibold'>Newest Songs</h1>
        </div>
        <PageContent songs={songs} />
      </div>
    </div>
  );
};

export default Home;
