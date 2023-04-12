import { RelatedTracks } from '@/components/RelatedTracks';
import TrackDetail from '@/components/TrackDetail';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react'
import { fetchTracks } from '../[countryCode]';
import { useDashboardCtx } from '@/contexts';
import { useUserSession } from '@/hooks';

const TrackDetailPage = ({ track_key }) => {
    const { relatedTracks, handleSongRelatedTracks, country } = useDashboardCtx()

    const { status } = useUserSession()

    const manageFetching = () => {
        const url = "/shazam-songs/list-similarities"
        const params = { id: `track-similarities-id-${track_key}`, locale: `${country}`}
        console.log({url, params}, "<><>")
        return fetchTracks({ url, params })
    }

    const decideFetching = () => {
        const chkIdx = relatedTracks?.findIndex(item => (item.key == track_key) && (item?.data.length))

        if (chkIdx !== -1) {
            console.log("DONT FETCH")
            return false
        } else {
            setTimeout(() => {
                console.log("FETCH DATA")
                return true
            }, 4000)
        }
    }

    const formatData = (data) => {
        const formatedData = [];

        // console.log(data, "before")

        for(let key in data) {
            // console.log("before", data[key], data[key]?.attributes)
            const attr = data[key]?.attributes
            if(attr) {
                formatedData?.push(attr)
            }
        }

        // console.log(formatedData, "formatted datya")
        return formatedData
    }

    const { data } = useQuery({
        queryKey: ["related tracks", `${track_key}`],
        queryFn: manageFetching,
        refetchOnWindowFocus: false,
        enabled: decideFetching(),
        onSuccess: data => {
            handleSongRelatedTracks(formatData(data?.data?.resources["shazam-songs"]), track_key)
            // console.log(data?.data?.resources["shazam-songs"], "data!! success - related tracks!!", data)
        }
    })

    // console.log(data?.data, "DATA!!<><>!!")

    return (
        <main className='flex flex-col w-full'>
            {
                status === "loading"
                    ? <p className='px-2 text-2xl'>Loding Page....</p>
                    : status === "authenticated"
                        ?
                        <>
                            <div className='text-2xl w-full text-center'>TrackDetail -- {track_key}</div>
                            <Link className='text-xl bg-blue-400 px-4 py-1 rounded-lg w-fit' href={`/top-tracks/${country}`}>Go To Tracks List</Link>
                            <TrackDetail track_key={track_key} />
                            <RelatedTracks trackId={track_key} data={relatedTracks} />
                        </>
                        : null
            }
        </main>
    )
}

export const getServerSideProps = context => {
    const { params } = context;
    const { track_key } = params;

    // console.log(params, track_key, "check check!!")

    return {
        props: {
            track_key
        }
    }
}

export default TrackDetailPage