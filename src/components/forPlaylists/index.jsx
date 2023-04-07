import React, { use, useContext } from 'react'
import { AppContext } from '../appContext'
import { RenderTrackMinimalView } from '../TracksList'
import { AiOutlineDelete, AiOutlineScissor } from 'react-icons/ai'
import { internalApiRequest } from '@/utils/interceptor'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ShowWhenNoPlaylistIsFoundOrCreated } from '../forDashboard'
import { useDashboardCtx } from '@/contexts'

export const ShowUserPlaylists = ({ data }) => {
  const renderLists = () => data?.map((item, idx) => <RenderPlaylist key={item.name + idx} item={item} />)
  return (
    <section className='flex flex-wrap gap-4 w-full'>
      {
        data?.length
          ? renderLists()
          : <ShowWhenNoPlaylistIsFoundOrCreated />
      }
    </section>
  )
}

const RenderPlaylist = ({ item }) => {
  const { name, tracks } = item

  return (
    <div className='flex flex-col w-full'>
      <RenderNameCard name={name} />
      {/* <div className='flex gap-4'>
        <RenderNameCard name={name} />
        <button>Delete Playlist</button>
      </div> */}
      <p className='text-2xl my-2 bg-blue-200'>Lists Of Tracks In This Playlist</p>
      <RenderTracks tracks={tracks} name={name} />
    </div>
  )
}

const RenderTracks = ({ tracks, name }) => {
  const renderItems = () => tracks?.map((item, _, arr) => <RenderTrack key={item} keyId={item} name={name} tracks={arr} />)

  return (
    <div className='flex gap-4 flex-wrap self-start w-full'>
      {renderItems()}
    </div>
  )
}

const RenderTrack = ({ keyId, name, tracks }) => {
  // const appCtx = useContext(AppContext);
  const {topTracks, handleRemoveFromPlaylist} = useDashboardCtx()
  const { data: session } = useSession()
  const { id } = session?.user

  // const foundTrack = appCtx?.topTracks[0]?.data.find(item => item.key == keyId)

  let foundTrack = null

  // appCtx.topTracks?.forEach(lists => {
  //   foundTrack = lists?.data.find(item => item.key == keyId)
  // })
  topTracks?.forEach(lists => {
    foundTrack = lists?.data.find(item => item.key == keyId)
  })

  console.log(topTracks?.data, keyId, foundTrack, topTracks)
  // console.log(appCtx?.topTracks?.data, keyId, foundTrack, appCtx?.topTracks)

  const deleteTrackFromDb = () => {
    const url = "/playlists";
    // const data = { userId: "user1", name: name, trackId: keyId };
    const data = { userId: id, name: name, trackId: keyId };
    // const params = {userId: "user1"}
    const method = "DELETE"
    return internalApiRequest({ url, data, method })
  }

  const handleRemoveTrack = () => {
    console.log(keyId, "!!delete!!")
    // appCtx?.topTracks[0]?.data.filter(item => item.key == keyId)
    deleteTrackFromDb().then(() => {
      console.log("deleted successfully from db")
      // appCtx.handleRemoveFromPlaylist("user1", name, keyId)
      // appCtx.handleRemoveFromPlaylist(id, name, keyId)

      handleRemoveFromPlaylist(id, name, keyId)
    }).catch(err => console.log(err))

    // appCtx.handleRemoveFromPlaylist("user1", name, keyId)
  }

  return (
    <div className={`${tracks?.length >= 2 ? "w-1/3" : "w-1/2"} bg-stone-200 rounded-md px-1`}>
      {
        foundTrack
          ? <RenderTrackMinimalView track={foundTrack} fromSearch={true} fromPlaylist={true} />
          : <Link className='bg-stone-200' href={"/top-tracks"}>Checkout Trending Music First, And Then Come Back Here To See This Track Detail, As These Are Sourced From Country's Top Tracks Lists!!</Link>
      }
      {foundTrack && <button onClick={handleRemoveTrack} className='text-lg font-bold flex gap-2 items-center bg-neutral-400 text-red-800 rounded-lg my-1 mt-6 w-full'><AiOutlineScissor size={"31px"} /> <span className='text-center w-full text-xl'>Remove From Playlist</span></button>}
    </div>
  )
}

const RenderNameCard = ({ name, url }) => {
  // const appCtx = useContext(AppContext);
  const {handleRemoveFromPlaylist} = useDashboardCtx()
  const { data: session } = useSession()
  const { id } = session?.user

  const deletePlaylistFromDb = () => {
    const url = "/playlists";
    const data = { userId: id, name: name, delPlist: true };
    // const data = { userId: "user1", name: name, delPlist: true };
    // const params = {userId: "user1"}
    const method = "DELETE"
    return internalApiRequest({ url, data, method })
  }

  const handleDelete = () => {
    deletePlaylistFromDb().then(() => {
      // appCtx.handleRemovePlaylist(id, name)
      handleRemoveFromPlaylist(id, name)
      // appCtx.handleRemovePlaylist("user1", name)
    }).catch(err => console.log("error occured....", err))
    // appCtx.handleRemovePlaylist("user1", name)
  }

  return (
    <div className='w-1/2 h-min'>
      {/* <h2 className='text-4xl text-sky-900'>{name}</h2> */}
      <div className='flex justify-between w-full items-center'>
        <h2 className='text-4xl text-sky-900'>{name}</h2>
        <button onClick={handleDelete} className='text-lg font-bold flex gap-2 items-center px-2 py-0 bg-neutral-400 text-red-800 rounded-lg mr-0'>
          <AiOutlineDelete fontSize={"22px"} />
          <span>Delete Playlist</span>
        </button>
      </div>
      <img
        className='w-full'
        src={url || "https://source.unsplash.com/random"}
        // width={450} height={450} 
        style={{ maxHeight: "290px" }}
      />
    </div>
  )
}