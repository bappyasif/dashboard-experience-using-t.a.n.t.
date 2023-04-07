import { SelectCountry } from '@/components/select-country';
import { useDashboardCtx } from '@/contexts';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

const TopTracksByCountry = () => {
    const {handleUpdateCountryName} = useDashboardCtx()

    const router = useRouter();

    const {status, data: session} = useSession()

    const handleCountryChange = (e) => {
        handleUpdateCountryName(e.target.value != -1 ? e.target.value : "BD")
        router.push(`/top-tracks/${e.target.value != -1 ? e.target.value : "BD"}`)
    }

    useEffect(()  => {
        status == "unauthenticated" ? signIn() : null
    }, [status])
    
    return (
        <main className='flex flex-col text-4xl w-full'>
            <div>TopTracks</div>
            <SelectCountry handleCountryChange={handleCountryChange} />
        </main>
    )
}

export default TopTracksByCountry