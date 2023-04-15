import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineCheck, AiOutlineReconciliation } from 'react-icons/ai';
import { useToFetchPlaylists, useWhenClickedOutside } from '@/hooks';
import { internalApiRequest } from '@/utils/interceptor';
import { signIn, useSession } from 'next-auth/react';
import { useDashboardCtx } from '@/contexts';

export const TracksList = ({ data }) => {
    const [tracksData, setTracksData] = useState([]);

    const {topTracks, country} = useDashboardCtx()

    const performAlreadyExistingTopTracksData = () => {
        // console.log(topTracks, "topTracks!!")
        const findCountryTopTracks = topTracks?.find(item => item.countryCode == country)
        if (findCountryTopTracks !== undefined) {
            setTracksData(findCountryTopTracks.data)
        }
    }

    const { status } = useSession();

    useEffect(() => {
        status === "unauthenticated" ? signIn() : null
    }, [status])

    useEffect(() => {
        performAlreadyExistingTopTracksData()
    }, [topTracks, country])

    const renderTracks = () => (data || tracksData)?.map(track => track?.images && <RenderTrackMinimalView key={track.key} track={track} />)

    return (
        <>
            <Link className='text-xl bg-blue-400 p-2 rounded-lg font-bold' href={"/top-tracks"}>Choose Another Country List</Link>
            <h2 className='text-2xl bg-blue-200 my-4 font-extrabold'>Trending Tracks</h2>
            <section className='flex flex-wrap gap-4 justify-between pr-8'>
                {renderTracks()}
            </section>
        </>
    )
}

export const RenderTrackMinimalView = ({ track, fromSearch, fromPlaylist, fromDetect }) => {
    const [show, setShow] = useState(false);

    const ref = useRef()
    useWhenClickedOutside(ref, () => setShow(false));

    const { images, subtitle, title, key, webUrl } = track
    // const { background, coverart } = images
    // const { background, coverart, artistAvatar, coverArt } = images
    const { artistAvatar, coverArt } = images

    return (
        <article ref={ref} className={`${fromPlaylist ? "w-full" : fromDetect ? "w-1/2" : "w-1/4"} flex flex-col justify-between relative bg-stone-200 p-1 rounded-lg`} style={{ height: fromPlaylist ? "317px" : !fromPlaylist && fromSearch ? "418px" : "472px" }}>
            <div className='bg-teal-200 px-4 mb-1 rounded-md text-xl font-bold text-center'>
                {
                    fromSearch
                        ? <a target={"_blank"} href={`${webUrl}`}>{fromPlaylist ? "Listen To This Track" : "Click To Listen To This Track"}</a>
                        : <Link href={`/top-tracks/track-details/${key}`}>Click To See More Details</Link>
                }
            </div>

            <img
                src={artistAvatar || coverArt}
                style={{ maxHeight: fromPlaylist ? "301px" : "324px" }}
            />
            <p className={`text-2xl overflow-hidden text-ellipsis ${fromSearch ? "text-center" : ""}`} style={{
                lineHeight: "1em",
                maxHeight: "2em",
                lineClamp: 2
            }}>{title} -- {subtitle}</p>
            {
                !fromSearch
                    ? <button onClick={() => setShow(prev => !prev)} className='text-2xl bg-blue-200 px-4 py-1 rounded-md shadow-lg w-full font-bold'>Add to Playlist</button>
                    : null
            }
            <div className='absolute bottom-11 z-10 w-full pr-2'>
                {
                    show
                        ? <ShowPlaylists show={show} setShow={setShow} trackId={key} />
                        : null
                }
            </div>
        </article>
    )
}

export const ShowPlaylists = ({ show, setShow, trackId }) => {
    const [createNew, setCreateNew] = useState(false);

    const {playlists} = useDashboardCtx()
    
    const { data: session } = useSession();

    const openCreateNew = () => setCreateNew(true);

    const closeCreateNew = () => setCreateNew(false);

    useToFetchPlaylists()

    const userFound = playlists?.length && playlists?.find(item => item.userId == session?.user?.id)

    const renderPlaylists = () => userFound?.lists?.map(item => <PlaylistsDropdowns key={item.name} item={item} setShow={setShow} trackId={trackId} />)

    return (
        <div className='bg-blue-900'>
            {
                createNew
                    ? <PlayListUserInput closeCreateNew={closeCreateNew} />
                    : <button className='text-2xl text-slate-200 text-center w-full' onClick={openCreateNew}>Create Playlist</button>
            }
            {renderPlaylists()}
        </div>
    )
}

const PlayListUserInput = ({ closeCreateNew }) => {
    const [text, setText] = useState("")

    const { data: session } = useSession()

    const {handleAddNewPlaylist} = useDashboardCtx()

    const handleText = evt => setText(evt.target.value)

    const sendDataToDb = () => {
        const { id } = session?.user

        const response = internalApiRequest({ url: "/playlists", method: "POST", data: JSON.stringify({ name: text, userId: id }), headers: { "Content-Type": "application/json" } })

        // response.then(() => console.log("user playlist created successfully"))
        return response;
    }

    const handleCreate = () => {
        const { id } = session?.user
        const data = { name: text }

        sendDataToDb().then(() => {
            handleAddNewPlaylist(data, id)
            console.log("user playlist created successfully")
        })
        closeCreateNew()
    }

    // console.log(session, "SESSION!!")

    return (
        <div className=''>
            <input
                className='w-full text-2xl'
                type={"text"}
                onChange={handleText}
                placeholder={"Enter Your Playlist Name"}
            />
            <div className='flex gap-2 text-2xl'>
                <button onClick={handleCreate} className='bg-teal-200 py-1 px-4 w-full'>Create</button>
                <button onClick={closeCreateNew} className='bg-teal-200 py-1 px-4 w-full'>Cancel</button>
            </div>
        </div>
    )
}

const PlaylistsDropdowns = ({ item, setShow, trackId }) => {
    const [added, setAdded] = useState(false);

    const {handleAddToPlaylist, playlists} = useDashboardCtx()

    const { data: session } = useSession();

    const { name } = item;

    const updateDataInDb = () => {
        const url = "/playlists";
        const method = "PUT"
        const data = JSON.stringify({ name, trackId, userId: session?.user?.id })
        internalApiRequest({ url, method, data, headers: { "Content-Type": "application/json" } })
    }

    const handleClick = () => {
        handleAddToPlaylist(session?.user?.id, name, trackId)
        updateDataInDb();
        setShow(false)
    }

    const checkInWhichPlaylist = () => {
        const filtered = playlists?.filter(item => item.userId == session?.user?.id && item?.lists?.length)
        
        // console.log(playlists, filtered)

        filtered[0]?.lists?.forEach(item => {
            if (item?.name == name && item?.tracks?.length) {
                setAdded(item.tracks.includes(trackId))
            }
        })
    }

    useEffect(() => {
        trackId && checkInWhichPlaylist()
    }, [trackId])

    return (
        <div style={{ cursor: "pointer" }} className="flex gap-2 items-center text-xl text-zinc-400 justify-between outline outline-1 outline-red-200 px-2 mt-2" onClick={handleClick}>
            <span className='text-ellipsis overflow-hidden w-1/2'>{name}</span>
            <span className='w-1/2 flex justify-center text-4xl'>{added ? <AiOutlineCheck /> : <AiOutlineReconciliation />}</span>
        </div>
    )
}