import { ShowUserPlaylists } from '@/components/forPlaylists';
import { useDashboardCtx } from '@/contexts';
import { useToFetchPlaylists } from '@/hooks';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react'

const UserPlaylists = () => {
  const { playlists } = useDashboardCtx()

  const { data: session, status } = useSession();

  const { data } = useToFetchPlaylists()

  const foundPlaylists = playlists?.find(item => (item?.userId == session?.user?.id) && item?.lists?.length)

  useEffect(() => {
    status == "unauthenticated" ? signIn() : null
  }, [status])

  return (
    <main className='w-full'>
      <h1 className='text-6xl bg-blue-200 mb-4'>User Playlists</h1>
      <ShowUserPlaylists data={foundPlaylists?.lists} />
    </main>
  )
}

export default UserPlaylists