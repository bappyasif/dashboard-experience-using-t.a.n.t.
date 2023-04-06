import { AppContext } from '@/components/appContext';
import { SelectCountry } from '@/components/select-country';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react'

const TopTracksByCountry = () => {
    const appCtx = useContext(AppContext)

    const router = useRouter();

    const {status, data: session} = useSession()

    const handleCountryChange = (e) => {
        appCtx.handleCountry(e.target.value != -1 ? e.target.value : "BD")
        router.push(`/top-tracks/${e.target.value != -1 ? e.target.value : "BD"}`)
    }

    useEffect(()  => {
        // (status == "unauthenticated" || status == "loading" && status !== "authenticated") && console.log(status, "STATIS")
        // status == "unauthenticated" || status == "loading" ? signIn() : null
        // (!session) ? signIn() : null
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