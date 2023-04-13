import { TracksList } from '@/components/TracksList'
import { useDashboardCtx } from '@/contexts'
import { useUserSession } from '@/hooks'
import { countriesCodes } from '@/utils/data'
import { shazamApiDojoInterceptor } from '@/utils/interceptor'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export const fetchTracks = (options) => shazamApiDojoInterceptor(options)

const TopTracksByCountry = ({ countryCode }) => {
    const { topTracks, handleCountrySpecificTrends, handleUpdateCountryName } = useDashboardCtx()

    const { status } = useUserSession()

    const manageFetching = () => {
        const url = "/charts/track"
        const params = { country_code: countryCode, limit: '100' }
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
            handleCountrySpecificTrends(data?.data?.tracks, countryCode)
            handleUpdateCountryName(countryCode)
            // console.log(data, "data!! success -- Top Tracks", data?.data?.tracks, countryCode)
        }
    })

    if (isError) {
        return <h2>Error Occured.... {error.message}</h2>
    }

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