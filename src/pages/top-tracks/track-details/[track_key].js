import { AppContext } from '@/components/appContext';
import { RelatedTracks } from '@/components/RelatedTracks';
import TrackDetail from '@/components/TrackDetail';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react'
import { fetchTracks } from '../[countryCode]';
import { useDashboardCtx } from '@/contexts';

const TrackDetailPage = ({ track_key }) => {
    // const appCtx = useContext(AppContext);
    const {relatedTracks, handleSongRelatedTracks, country} = useDashboardCtx()

    const manageFetching = () => {
        const url = "/related_tracks"
        const params = { track_id: track_key, limit: '20', start_from: '0' }
        return fetchTracks({ url, params })
    }

    // const decideFetching = () => {
    //     const chkIdx = appCtx.relatedTracks.findIndex(item => item.key == track_key)

    //     if (chkIdx !== -1) {
    //         const timer = setTimeout(() => {
    //             console.log(appCtx.relatedTracks[chkIdx], "<><><><>", Object.values(appCtx.relatedTracks[chkIdx])[0], Object.values(appCtx.relatedTracks[chkIdx])[0]?.length)
    //             if(timer > 2000) {
    //              clearTimeout(timer)
    //             }
    //             return Object.values(appCtx.relatedTracks[chkIdx])[0]?.length ? false : true
    //         }, 1800)

    //     } else {
    //         return chkIdx !== -1 ? false : true
    //     }
    // }

    const decideFetching = () => {
        // const chkIdx = appCtx.relatedTracks.findIndex(item => (item.key == track_key) && (item?.data.length))
        const chkIdx = relatedTracks?.findIndex(item => (item.key == track_key) && (item?.data.length))

        if (chkIdx !== -1) {
            console.log("DONT FETCH DATA")
            return false
        } else {
            // return true
            setTimeout(() => {
                // console.log("FETCH DATA", appCtx.relatedTracks)
                console.log("FETCH DATA", relatedTracks)
                return true
                // return chkIdx !== -1 ? false : true
            }, 4000)
        }
    }

    const { data } = useQuery({
        queryKey: ["related tracks", `${track_key}`],
        queryFn: manageFetching,
        refetchOnWindowFocus: false,
        // enabled: false,
        enabled: decideFetching(),
        onSuccess: data => {
            handleSongRelatedTracks(data?.data?.result?.tracks, track_key)
            // appCtx.handleRelatedTracks(data?.data?.result?.tracks, track_key)
            console.log(data, "data!! success - related tracks!!", data?.data?.result?.tracks)
        }
    })

    // console.log(data?.data, "DATA!!<><>!!")

    return (
        <main className='flex flex-col w-full'>
            <div className='text-2xl w-full text-center'>TrackDetail -- {track_key}</div>
            {/* <Link className='text-xl bg-blue-400 px-4 py-1 rounded-lg w-fit' href={`/top-tracks/${appCtx.country}`}>Go To Tracks List</Link> */}
            <Link className='text-xl bg-blue-400 px-4 py-1 rounded-lg w-fit' href={`/top-tracks/${country}`}>Go To Tracks List</Link>
            <TrackDetail track_key={track_key} />
            {/* <RelatedTracks trackId={track_key} data={appCtx.relatedTracks} /> */}
            <RelatedTracks trackId={track_key} data={relatedTracks} />
        </main>
    )
}

export const getServerSideProps = context => {
    const { params } = context;
    const { track_key } = params;

    console.log(params, track_key, "check check!!")

    return {
        props: {
            track_key
        }
    }
}

export default TrackDetailPage