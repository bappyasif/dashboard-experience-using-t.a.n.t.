import { ShowUserPlaylists } from '@/components/forPlaylists';
import { useDashboardCtx } from '@/contexts';
import { useToFetchPlaylists, useUserSession } from '@/hooks';
import React from 'react'

const UserPlaylists = () => {
  const { playlists } = useDashboardCtx()

  const { session, status } = useUserSession()

  useToFetchPlaylists()

  const foundPlaylists = playlists?.find(item => (item?.userId == session?.user?.id) && item?.lists?.length)

  return (
    <main className='w-full'>
      {
        status === "loading"
          ? <p className='px-2 text-2xl'>Loding Page....</p>
          : status === "authenticated"
            ?
            <>
              <h1 className='text-6xl bg-blue-200 mb-4'>User Playlists</h1>
              <ShowUserPlaylists data={foundPlaylists?.lists} />
            </>
            : null
      }
    </main>
  )
}

export default UserPlaylists