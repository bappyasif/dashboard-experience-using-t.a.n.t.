import { TracksList } from '@/components/TracksList'
import { useDashboardCtx } from '@/contexts'
import { useUserSession } from '@/hooks'
import { countriesCodes } from '@/utils/data'
import { shazamApiInterceptor } from '@/utils/interceptor'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export const fetchTracks = (options) => shazamApiInterceptor(options)

const TopTracksByCountry = ({ countryCode }) => {
    const { topTracks, handleCountrySpecificTrends } = useDashboardCtx()

    const { status } = useUserSession()

    const manageFetching = () => {
        const url = "/top_country_tracks"
        const params = { country_code: countryCode, limit: '100', start_from: '0' }
        return fetchTracks({ url, params })
    }

    const decideFetching = () => {
        if (!topTracks?.length) return true

        const findCountryTopTracks = topTracks.find(item => item.countryCode == countryCode)

        // console.log(findCountryTopTracks, findCountryTopTracks !== undefined, topTracks)

        return findCountryTopTracks !== undefined ? false : true
    }

    const { data: tracks, isError, isLoading, error } = useQuery({
        queryKey: ["top-tracks", `${countryCode}`],
        queryFn: manageFetching,
        refetchOnWindowFocus: false,
        enabled: decideFetching(),
        onSuccess: data => {
            handleCountrySpecificTrends(data?.data?.result?.tracks, countryCode)
            // console.log(data, "data!! success -- Top Tracks")
        }
    })

    if (isError) {
        return <h2>Error Occured.... {error.message}</h2>
    }

    // console.log(appCtx.country != countryCode, appCtx.country, countryCode, "checks!!")

    return (
        <main>
            {
                status === "loading"
                    ? <p className='px-2 text-2xl'>Loding Page....</p>
                    : status === "authenticated"
                        ?
                        <>
                            <div className='text-center text-4xl my-2'>Currently Viewing: Top Tracks In {countriesCodes[countryCode]}</div>
                            <TracksList data={tracks?.data?.result?.tracks} countryCode={countryCode} />
                        </>
                        : null
            }
        </main>
    )
}

export const getServerSideProps = async (context) => {
    const { params } = context
    const { countryCode } = params

    return {
        props: {
            countryCode: countryCode,
        }
    }
}

export default TopTracksByCountry