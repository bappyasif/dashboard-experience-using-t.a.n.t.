import { SelectCountry } from '@/components/select-country';
import { useDashboardCtx } from '@/contexts';
import { useUserSession } from '@/hooks';
import { useRouter } from 'next/router';
import React from 'react'

const TopTracksByCountry = () => {
    const { handleUpdateCountryName } = useDashboardCtx()

    const router = useRouter();

    const { status } = useUserSession()

    const handleCountryChange = (e) => {
        handleUpdateCountryName(e.target.value != -1 ? e.target.value : "BD")
        router.push(`/top-tracks/${e.target.value != -1 ? e.target.value : "BD"}`)
    }

    return (
        <main className='flex flex-col text-4xl w-full'>
            {
                status === "loading"
                    ? <p className='px-2 text-2xl'>Loding Page....</p>
                    : status === "authenticated"
                        ?
                        <>
                            <div className='text-fuchsia-200'>Trending Tracks</div>
                            <SelectCountry handleCountryChange={handleCountryChange} />
                        </>
                        : null
            }
        </main>
    )
}

export default TopTracksByCountry