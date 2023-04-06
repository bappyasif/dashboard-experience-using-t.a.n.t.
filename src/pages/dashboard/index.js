import { AlreadyExistingPlaylistsByThisUser, TrendingLists } from '@/components/forDashboard';
import { signIn, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

const UserDashboard = () => {
    const {data: session, status} = useSession();

    useEffect(() => {
        status==="unauthenticated"? signIn() : null
    }, [status])

  return (
    <main className='text-xl w-full'>
        <h1 className='text-5xl'>Dear {session?.user?.name}</h1>
        <h2 className='text-4xl'>Welcome to your dashboard</h2>
        {/* <h2 className='text-2xl'>Things You Can Do From Here</h2> */}
        <h2 className='text-3xl bg-blue-200 my-4'>Trending Tracks By Country Which Has Already Been Viewed</h2>
        <TrendingLists />
        <h2 className='text-3xl bg-blue-200 my-4'>Already Existing Playlists By This User</h2>
        <AlreadyExistingPlaylistsByThisUser session={session} />
    </main>
  )
}

export default UserDashboard