import { AppContext } from '@/components/appContext'
import { TracksList } from '@/components/TracksList'
import { useDashboardCtx } from '@/contexts'
import { countriesCodes } from '@/utils/data'
import { shazamApiInterceptor } from '@/utils/interceptor'
import { useQuery } from '@tanstack/react-query'
import React, { useContext } from 'react'

export const fetchTracks = (options) => shazamApiInterceptor(options)

const TopTracksByCountry = ({ countryCode }) => {
    // const appCtx = useContext(AppContext)
    const {topTracks, handleCountrySpecificTrends} = useDashboardCtx()

    // console.log(data, "DATA<><>!!")
    const manageFetching = () => {
        const url = "/top_country_tracks"
        const params = { country_code: countryCode, limit: '100', start_from: '0' }
        return fetchTracks({ url, params })
    }

    const decideFetching = () => {
        // const chkIdx = appCtx?.topTracks.findIndex(item => Object.keys(item)[0] == countryCode)
        // return chkIdx !== -1 ? false : true
        
        // if(!appCtx.topTracks?.length) return true
        if(!topTracks?.length) return true

        // const findCountryTopTracks = appCtx.topTracks.find(item => item.countryCode == countryCode)
        const findCountryTopTracks = topTracks.find(item => item.countryCode == countryCode)
        // console.log(findCountryTopTracks, findCountryTopTracks !== undefined, appCtx.topTracks)
        console.log(findCountryTopTracks, findCountryTopTracks !== undefined, topTracks)
        
        return findCountryTopTracks !== undefined ? false : true
    }

    const { data: tracks, isError, isLoading, error } = useQuery({
        queryKey: ["top-tracks", `${countryCode}`],
        queryFn: manageFetching,
        refetchOnWindowFocus: false,
        // enabled: appCtx.country != Object.keys(appCtx.topTracks)[0] ? true : false,
        // enabled: appCtx.country != countryCode ? true : false,

        enabled: decideFetching(),
        onSuccess: data => {
            handleCountrySpecificTrends(data?.data?.result?.tracks, countryCode)
            // appCtx.handleTopTracks(data?.data?.result?.tracks, countryCode)
            console.log(data, "data!! success -- Top Tracks")
        }
    })

    // if(isLoading) {
    //   return <h2>Loading Data....</h2>
    // } else 
    if (isError) {
        return <h2>Error Occured.... {error.message}</h2>
    }

    // console.log(appCtx.country != countryCode, appCtx.country, countryCode, "checks!!")

    return (
        <main>
            <div className='text-center text-4xl my-2'>Currently Viewing: Top Tracks In {countriesCodes[countryCode]}</div>
            <TracksList data={tracks?.data?.result?.tracks} countryCode={countryCode} />
        </main>
    )
}

export const getServerSideProps = async (context) => {
    const { params } = context
    const { countryCode } = params

    // console.log(countryCode, "countryCode")

    // const manageFetching = () => {
    //     const url = "/top_country_tracks"
    //     const params = { country_code: countryCode, limit: '100', start_from: '0' }
    //     return fetchTracks({ url, params })
    // }

    // const data = await manageFetching().then(data => data)

    return {
        props: {
            countryCode: countryCode,
            // data: data?.data?.result?.tracks
        }
    }
}

export default TopTracksByCountry