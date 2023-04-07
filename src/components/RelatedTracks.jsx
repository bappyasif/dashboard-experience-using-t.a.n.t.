import React, { useEffect, useState } from 'react'
import { RenderTrackMinimalView } from './TracksList'

export const RelatedTracks = ({ data, trackId }) => {

    const renderableData = data?.find(item => item.key === trackId)

    // console.log(renderableData, "renderable data!!", renderableData?.data)

    const renderTracks = () => (renderableData?.data || [])?.map((item, idx) => item?.images && <RenderTrackMinimalView key={idx} track={item} fromSearch={true} />)

    return (
        <>
            <div className='text-4xl my-6 bg-blue-200'>Related Tracks Found For Track Id: {trackId}</div>
            <section className='flex gap-11 flex-wrap'>
                {renderTracks()}
            </section>
        </>
    )
}