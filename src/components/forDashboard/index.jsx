import React, { useContext, useEffect } from 'react'
import { AppContext } from '../appContext'
import { countriesCodes } from "../../utils/data"
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';

export const TrendingLists = () => {
  const appCtx = useContext(AppContext);

  const { data: session, status } = useSession();

  useEffect(() => {
    status === "unauthenticated" ? signIn() : null
  }, [status])

  console.log(appCtx?.topTracks, "top tracks")
  
  const renderCountriesListsViewed = () => appCtx?.topTracks.map(item => <CountryListsDetails key={item.countryCode} item={item} />)

  return (
    <section className='flex gap-4 justify-between px-4'>
      {/* <div>TrendingLists</div> */}
      {
        appCtx?.topTracks?.length
          ? renderCountriesListsViewed()
          : <ShowWhenNoTrendingListVisited />
      }
      {/* {renderCountriesListsViewed()} */}
    </section>
  )
}

const RenderTopTracksLink = () => {
  return <span>lets change that from <Link className='bg-stone-200 px-4 rounded-full w-fit' href={"/top-tracks"}>here</Link></span>
}

const ShowWhenNoTrendingListVisited = () => {
  return (
    <div className='text-2xl'>
      <p>you havent visited any trending songs list from any country yet</p>
      <RenderTopTracksLink />
    </div>
  )
}

const CountryListsDetails = ({ item }) => {
  const { countryCode, data } = item;

  const getFlagEmoji = countryCode => String.fromCodePoint(...[...countryCode.toUpperCase()].map(x => 0x1f1a5 + x.charCodeAt()))

  // getFlagEmoji('GB') // 🇬🇧
  // getFlagEmoji('JP') // 🇯🇵
  // getFlagEmoji('ZA') // 🇿🇦



  return (
    <div className='text-2xl my-2 mb-6'>
      <h2><span>{countriesCodes[countryCode]}</span></h2>
      <div><span className='text-6xl'>{getFlagEmoji(countryCode)}</span></div>
      <h2>Trending Songs: <span>{data?.length}*</span></h2>
      <Link className='bg-stone-200 px-4 rounded-full' href={`/top-tracks/${countryCode}`}>Visit Again And See This Trending List By Clicking Here</Link>
      {/* <img src="https://www.countryflags.io/eu/shiny/64.png"></img> */}
      {/* <img src="https://flagcdn.com/48x36/za.png" /> */}
    </div>
  )
}

export const AlreadyExistingPlaylistsByThisUser = ({ session }) => {
  const appCtx = useContext(AppContext);

  const foundPlaylists = appCtx?.playlists?.find(item => (item?.userId == session?.user?.id) && item?.lists?.length)

  const renderLists = () => foundPlaylists?.lists.map(item => <RenderPlaylistMinimumView key={item.name} item={item} />);

  return (
    <section className='flex gap-4 flex-wrap text-2xl justify-between px-4'>
      {/* <h2>Lists</h2> */}
      {/* {renderLists()} */}
      {
        foundPlaylists?.lists
          ? renderLists()
          : <ShowWhenNoPlaylistIsFoundOrCreated />
      }
    </section>
  )
}

export const ShowWhenNoPlaylistIsFoundOrCreated = () => {
  return (
    <div className='text-2xl'>
      <p>you havent created any playlist from any trending lists yet</p>
      <RenderTopTracksLink />
    </div>
  )
}

const RenderPlaylistMinimumView = ({ item }) => {
  const { name, tracks } = item

  return (
    <div>
      {/* <h2>Playlist Name: {name}</h2>
      <p>Number Of Tracks In This Playlist: {tracks?.length}</p> */}
      <h2>Playlist: <span className='bg-teal-200 font-bold px-2'>{name}</span></h2>
      <p>Tracks: <span className='bg-teal-200 font-bold px-2'>{tracks?.length}</span></p>
      <p className='flex flex-col gap-2'>
        <Link className='bg-stone-200 px-4 rounded-full w-fit' href={"/playlists"}>See Details About Playlists</Link>
        <Link className='bg-stone-200 px-4 rounded-full w-fit' href={"/top-tracks"}>Add More Tracks From Trending Lists</Link>
      </p>
    </div>
  )
}