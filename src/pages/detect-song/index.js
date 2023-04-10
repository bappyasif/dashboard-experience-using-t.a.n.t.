import { RecordMedia } from '@/components/forSongDetection'
import { useUserSession } from '@/hooks'
import React from 'react'

const DetectSong = () => {
  const {status} = useUserSession()

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