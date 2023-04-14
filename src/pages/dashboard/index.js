import { AlreadyExistingPlaylistsByThisUser, TrendingLists } from '@/components/forDashboard';
import { useToFetchPlaylists, useUserSession } from '@/hooks';
import React from 'react'

const UserDashboard = () => {
  const { session, status } = useUserSession();

  useToFetchPlaylists()

  return (
    <main className='text-xl w-full'>
      {
        status === "loading"
          ? <p className='px-2 text-2xl'>Loding Page....</p>
          : status === "authenticated"
            ?
            <>
              <h1 className='text-5xl'>Dear {session?.user?.name}</h1>
              <h2 className='text-4xl'>Welcome to your dashboard</h2>
              {/* <h2 className='text-2xl'>Things You Can Do From Here</h2> */}
              <h2 className='text-3xl bg-blue-200 my-4'>Trending Tracks By Country Which Has Already Been Viewed</h2>
              <TrendingLists />
              <h2 className='text-3xl bg-blue-200 my-4'>Already Existing Playlists By This User</h2>
              <AlreadyExistingPlaylistsByThisUser session={session} />
            </>
            : null
      }
    </main>
  )
}

export default UserDashboard