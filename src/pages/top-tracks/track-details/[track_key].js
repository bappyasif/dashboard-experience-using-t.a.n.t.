import { RelatedTracks } from '@/components/RelatedTracks';
import TrackDetail from '@/components/TrackDetail';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react'
import { fetchTracks } from '../[countryCode]';
import { useDashboardCtx } from '@/contexts';

const TrackDetailPage = ({ track_key }) => {
    const {relatedTracks, handleSongRelatedTracks, country} = useDashboardCtx()

    const manageFetching = () => {
        const url = "/related_tracks"
        const params = { track_id: track_key, limit: '20', start_from: '0' }
        return fetchTracks({ url, params })
    }

    const decideFetching = () => {
        const chkIdx = relatedTracks?.findIndex(item => (item.key == track_key) && (item?.data.length))

        if (chkIdx !== -1) {
            console.log("DONT FETCH DATA")
            return false
        } else {
            setTimeout(() => {
                console.log("FETCH DATA")
                return true
            }, 4000)
        }
    }

    const { data } = useQuery({
        queryKey: ["related tracks", `${track_key}`],
        queryFn: manageFetching,
        refetchOnWindowFocus: false,
        enabled: decideFetching(),
        onSuccess: data => {
            handleSongRelatedTracks(data?.data?.result?.tracks, track_key)
            console.log("data!! success - related tracks!!")
        }
    })

    // console.log(data?.data, "DATA!!<><>!!")

    return (
        <main className='flex flex-col w-full'>
            <div className='text-2xl w-full text-center'>TrackDetail -- {track_key}</div>
            <Link className='text-xl bg-blue-400 px-4 py-1 rounded-lg w-fit' href={`/top-tracks/${country}`}>Go To Tracks List</Link>
            <TrackDetail track_key={track_key} />
            <RelatedTracks trackId={track_key} data={relatedTracks} />
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