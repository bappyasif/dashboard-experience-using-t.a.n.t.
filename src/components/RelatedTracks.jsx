import React, { useEffect, useState } from 'react'
import { RenderTrackMinimalView } from './TracksList'

export const RelatedTracks = ({ data, trackId }) => {
    console.log(data, "!!DaTa!!")

    const renderableData = data?.find(item => item.key === trackId)

    console.log(renderableData, "renderable data!!", renderableData?.data)

    // const renderData = () => (renderableData?.data || data)?.map((item, idx) => <RenderRelatedTrack key={idx} item={item} trackId={trackId} />)

    // const renderData = () => (renderableData?.data || [])?.map((item, idx) => <RenderRelatedTrack key={idx} item={item} trackId={trackId} />)

    const renderTracks = () => (renderableData?.data || [])?.map((item, idx) => item?.images && <RenderTrackMinimalView key={idx} track={item} fromSearch={true} />)

    return (
        <>
            <div className='text-4xl my-6 bg-blue-200'>Related Tracks Found For Track Id: {trackId}</div>
            {/* {renderData()} */}
            <section className='flex gap-11 flex-wrap'>
                {renderTracks()}
            </section>
        </>
    )
}

const RenderRelatedTrack = ({ item, trackId }) => {
    const [data, setData] = useState([])

    // const findTracks = () => {
    //     const foundItem = Object.keys(item).findIndex(val => val == trackId)
    //     if (foundItem !== -1) {
    //         // console.log("FOUND IT!!!!")
    //         // console.log("FOUND IT!!!!", Object.values(item)[0])
    //         setData(Object.values(item)[0])
    //     } else {
    //         console.log("NOT FOUND!!!!")
    //     }
    // }

    // console.log(item, "ITEM!!", trackId)

    useEffect(() => {
        trackId && item && setData(item)
        // trackId && findTracks()
    }, [trackId])

    const renderTracks = () => data?.map(item => (item?.images && item?.key != trackId) && <RenderTrackMinimalView key={item.key} track={item} />)

    // data?.forEach(item => console.log(item.key, "ITEM!!", item.key != trackId))

    return (
        <section className='flex gap-11 flex-wrap'>
            {renderTracks()}
        </section>
    )
}