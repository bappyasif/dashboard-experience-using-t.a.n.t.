import { RenderTrackMinimalView } from '@/components/TracksList'
import React, { useEffect, useState } from 'react'

export const RenderSongDetails = ({ data }) => {
  console.log(data, "DATAA!!!")
  return (
    <section className='flex gap-6 items-center w-full'>
      <RenderTrackMinimalView track={data} fromSearch={true} fromDetect={true} />
      <RenderSongLyrics item={data?.sections} />
    </section>
  )
}

const RenderSongLyrics = ({ item }) => {
  const [lyrics, setLyrics] = useState([])

  const runOnce = () => {
    const checkIfLyricExists = item?.find(item => item.tabname === "Lyrics" && item?.text?.length)
    if (checkIfLyricExists) {
      console.log(checkIfLyricExists)
      setLyrics(checkIfLyricExists.text)
    }
  }

  useEffect(() => {
    runOnce();
  }, [item])

  console.log(lyrics, "Lyrics!!")

  return (
    <p className='flex flex-col w-full gap-4 flex-wrap overflow-x-scroll' style={{ height: "402px" }}>
      {
         lyrics?.length
         ? lyrics?.map((line, idx) => <span className='px-4 text-justify' key={line + idx}>{line}</span>)
         : <span className='text-2xl px-6'>Lyrics Is Not Found.... :(</span>
      }
    </p>
  )
}
