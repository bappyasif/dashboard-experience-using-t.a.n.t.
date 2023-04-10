import { AppContext } from '@/components/appContext'
import { useDashboardCtx } from '@/contexts'
import { internalApiRequest, shazamApiInterceptor } from '@/utils/interceptor'
import { useQuery } from '@tanstack/react-query'
import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'

const beginFetch = (options) => shazamApiInterceptor(options)

export function useFetchSearchData(url, query, type, handleSearch, decideRefetching) {
  const { handleSearchedInfoData } = useDashboardCtx()

  const fetchTracks = () => {
    const params = { query: query, limit: '20', start_from: '0', lang: '-' }
    return beginFetch({ url, params })
  }

  const { data } = useQuery({
    queryKey: [`search ${type}`, `${query}`],
    queryFn: fetchTracks,
    refetchOnWindowFocus: false,
    enabled: decideRefetching(),
    onSuccess: data => {
      handleSearch()
      data?.data?.result?.hits && handleSearchedInfoData(type, query, data?.data?.result?.hits)
    }
  })

  return data?.data?.result?.hits
}


export function useWhenClickedOutside(ref, handler) {
  useEffect(() => {
    let listener = event => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler(event)
    }

    document.addEventListener('mousedown', listener)

    return () => document.removeEventListener('mousedown', listener)

  }, [ref, handler])
}

export function useToFetchPlaylists() {
  const { data: session, status } = useSession();
  const { playlists, handleInitaialUserPlaylist } = useDashboardCtx()

  const fetchingPlaylist = () => {
    const url = "/playlists";
    const method = "GET";
    const params = { userId: session?.user?.id };
    return internalApiRequest({ url, method, params })
  }

  const { data } = useQuery({
    queryKey: ["fetching playlist", `${session?.user?.id}`],
    queryFn: fetchingPlaylist,
    refetchOnWindowFocus: false,
    enabled: status === "authenticated" && playlists?.length == 0,
    onSuccess: data => {
      // console.log("fetched playlists!!", data?.data?.result)
      handleInitaialUserPlaylist(data?.data?.result)
    }
  })

  return { data }
}

export const useUserSession = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    status == "unauthenticated" ? signIn() : null
  }, [status])

  return { session, status }
}