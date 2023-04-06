import Link from 'next/link';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AiOutlineCheck, AiOutlineReconciliation } from 'react-icons/ai';
import { AppContext } from './appContext'
import { useToFetchPlaylists, useWhenClickedOutside } from '@/hooks';
import { internalApiRequest } from '@/utils/interceptor';
import { signIn, useSession } from 'next-auth/react';

export const TracksList = ({ data, countryCode }) => {
    const [tracksData, setTracksData] = useState([]);

    const appCtx = useContext(AppContext);

    const performAlreadyExistingTopTracksData = () => {
        const findCountryTopTracks = appCtx.topTracks.find(item => item.countryCode == appCtx.country)
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
    }, [])

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

export const RenderTrackMinimalView = ({ track, fromSearch, fromPlaylist }) => {
    const [show, setShow] = useState(false);

    const ref = useRef()
    useWhenClickedOutside(ref, () => setShow(false));

    const { images, subtitle, title, key, url } = track
    const { background, coverart } = images

    return (
        <article ref={ref} className={`${fromPlaylist ? "w-full" : "w-1/4"} flex flex-col justify-between relative bg-stone-200 p-1 rounded-lg`} style={{ height: fromPlaylist ? "317px" : !fromPlaylist && fromSearch ? "418px" : "472px" }}>
            <div className='bg-teal-200 px-4 mb-1 rounded-md text-xl font-bold text-center'>
                {
                    fromSearch
                        ? <a target={"_blank"} className='' href={`${url}`}>{fromPlaylist ? "Listen To This Track" : "Click To Listen To This Track"}</a>
                        : <Link className='' href={`/top-tracks/track-details/${key}`}>Click To See More Details</Link>
                }
            </div>

            <img
                // className={fromPlaylist ? "h-full w-full" : "h-full"} 
                src={background || coverart}
                style={{ maxHeight: fromPlaylist ? "301px" : "324px" }}
            // style={{maxHeight: !fromPlaylist && "324px"}}
            // width={"100%"} 
            // height={310} 
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
            {/* {
                show
                    ? <ShowPlaylists setShow={setShow} />
                    : null
            } */}
        </article>
    )
}

export const ShowPlaylists = ({ show, setShow, trackId }) => {
    const [createNew, setCreateNew] = useState(false);
    // const [fetchPlaylists, setFetchPlaylists] = useState(true);
    const openCreateNew = () => setCreateNew(true);
    const closeCreateNew = () => setCreateNew(false);
    const appCtx = useContext(AppContext);
    const { data: session } = useSession();

    // const ref = useRef()
    // useWhenClickedOutside(ref, () => setShow(false));
    // useWhenClickedOutside(ref, closeCreateNew);

    // const {data} = useToFetchPlaylists(fetchPlaylists, setFetchPlaylists)
    // useToFetchPlaylists(fetchPlaylists, setFetchPlaylists)
    useToFetchPlaylists()

    // const userFound = appCtx?.playlists?.find(item => item.userId == "user1")
    const userFound = appCtx?.playlists?.find(item => item.userId == session?.user?.id)

    // console.log(appCtx.playlists, "appCtx.playlists", trackId)

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

    const appCtx = useContext(AppContext);

    // const ref = useRef()
    // useWhenClickedOutside(ref, () => setShow(false));

    const handleText = evt => setText(evt.target.value)

    // const sendDataToDb = async () => {
    //     const response = await internalApiRequest({url: "/playlists", method: "post", body: {"name": "p1"}, headers: {"Content-Type": "application/json"}})
    //     // const response = await fetch({url: "/playlists", method: "post", body: {"name": "p1"}})
    //     // const response = await fetch("/playlists", {method: "post", body: {"name": "p1"}, headers: {"Content-Type": "application/json"}})
    //     // const data = await response?.json();

    //     // console.log(data, "DATADATADATADATA", response)

    //     console.log("DATADATADATADATA", response)
    // }

    const sendDataToDb = () => {
        // const response = internalApiRequest({url: "/playlists", method: "post", body: JSON.stringify({"name": "p1"}), headers: {"Content-Type": "application/json"}})
        const { id } = session?.user

        // const response = internalApiRequest({url: "/playlists", method: "POST", data: JSON.stringify({name: text, userId: "user1"}), headers: {"Content-Type": "application/json"}})

        const response = internalApiRequest({ url: "/playlists", method: "POST", data: JSON.stringify({ name: text, userId: id }), headers: { "Content-Type": "application/json" } })

        response.then(value => console.log(value))
    }

    const handleCreate = () => {
        // console.log(text)
        const { id } = session?.user
        const data = { name: text }

        appCtx?.handlePlaylists(data, id)
        // appCtx?.handlePlaylists(data, "user1")

        sendDataToDb()
        closeCreateNew()
    }

    console.log(session, "SESSION!!")

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

    const appCtx = useContext(AppContext);

    const { data: session } = useSession();

    const { name } = item;

    const updateDataInDb = () => {
        const url = "/playlists";
        const method = "PUT"
        const data = JSON.stringify({ name, trackId, userId: session?.user?.id })
        // const data = JSON.stringify({name, trackId, userId: "user1"})
        internalApiRequest({ url, method, data, headers: { "Content-Type": "application/json" } })
    }

    const handleClick = () => {
        // const data = {name, }
        // appCtx.handleAddToPlaylist("user1", name, trackId)
        appCtx.handleAddToPlaylist(session?.user?.id, name, trackId)
        updateDataInDb();
        setShow(false)
    }

    const checkInWhichPlaylist = () => {
        // const filtered = appCtx.playlists?.filter(item => item.userId === "user1" && item?.lists?.length)
        const filtered = appCtx.playlists?.filter(item => item.userId == session?.user?.id && item?.lists?.length)
        // const filtered = appCtx.playlists?.filter(item => {
        //     console.log(item.userId == session?.user?.id && item?.lists?.length, item.userId, session?.user?.id, item.userId == session?.user?.id, item?.lists?.length)
        //     return item.userId == session?.user?.id && item?.lists?.length
        // })

        console.log(appCtx.playlists, filtered)

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
        <div style={{ cursor: "pointer" }} className="flex gap-2 items-center text-xl justify-between outline outline-1 outline-red-200 px-2 mt-2" onClick={handleClick}>
            <span className='text-ellipsis overflow-hidden w-1/2'>{name}</span>
            <span className='w-1/2 flex justify-center text-4xl'>{added ? <AiOutlineCheck /> : <AiOutlineReconciliation />}</span>
        </div>
    )
}