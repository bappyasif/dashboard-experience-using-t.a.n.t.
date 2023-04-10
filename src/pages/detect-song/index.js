import { RecordMedia } from '@/components/forSongDetection'
import { signIn, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

const DetectSong = () => {
  const {status} = useSession()

  // if(status === "loading") {
  //   return <p className='px-2 text-2xl'>Loding Page....</p>
  // }

  useEffect(() => {
    status === "unauthenticated" ? signIn() : null
  })

  return (
    <main className='w-full'>
      {
        status === "loading"
        ? <p className='px-2 text-2xl'>Loding Page....</p>
        : status === "authenticated"
        ? <RecordMedia />
        : null
      }
    </main>
  )
}

export default DetectSong