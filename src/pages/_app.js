import { AppContext } from '@/components/appContext';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { SessionProvider } from "next-auth/react";
import { DashboardContextProvider } from '@/contexts';

export default function App({ Component, pageProps }) {
  const [topTracks, setTopTracks] = useState([]);

  const [relatedTracks, setRelatedTracks] = useState([]);

  const [country, setCountry] = useState("");

  const [searchedData, setSearchedData] = useState([]);

  const [playlists, setPlaylists] = useState([]);

  const handleRemovePlaylist = (userId, playlistName) => {
    const newList = playlists.map(item => {
      if (item?.userId == userId) {
        item.lists = item?.lists.filter(list => list.name !== playlistName)
      }
      return item
    })

    newList?.length && setPlaylists(newList);
    console.log(newList, "NEWLIST!!")
  }

  const handleRemoveFromPlaylist = (userId, playlistName, trackId) => {
    setPlaylists(prev => {
      return prev.map(item => {
        if (item.userId == userId) {
          item.lists?.forEach(list => {
            if (list.name == playlistName) {
              const newTracks = list?.tracks.filter(val => val != trackId);
              list.tracks = newTracks;
            }
            // console.log(list, item, "<><>", prev)
          })
        }
        // console.log(prev, "after")
        return prev[0]
      })
    })
  }

  const handleAddToPlaylist = (userId, playlistName, trackId) => {
    setPlaylists(prev => {
      return prev.map(item => {
        if (item.userId == userId) {
          const specificList = item.lists.find(item => item.name == playlistName)
          if (specificList !== -1) {
            const checkIfExistAlready = specificList?.tracks?.includes(trackId)
            if (checkIfExistAlready == undefined) {
              specificList.tracks = [trackId]
            } else if (checkIfExistAlready === false) {
              specificList.tracks.push(trackId)
            }
          }
        }
        // console.log(prev, "after")
        return prev[0]
      })
    })
  }

  const handleInitialUserPlaylist = (userPlaylistData) => {
    setPlaylists([userPlaylistData])
  }

  const handlePlaylists = (newData, userId) => {
    const userPlaylists = playlists?.find(item => item.userId == userId)
    const chk = userPlaylists?.lists.findIndex(item => item.name === newData?.name)
    const newList = chk === -1 ? userPlaylists?.lists.push(newData) : [newData];

    if (userPlaylists === undefined) {
      setPlaylists(prev => [...prev, { userId, lists: [newData] }])
    } else {
      setPlaylists(prev => (chk === -1 && newList?.length) ? [...prev, { userId: userId, lists: newList }] : [...prev])
      // setPlaylists(prev => chk === -1 ? [...prev, {userId: userId, lists: newList}] : [...prev])
    }

    console.log(userPlaylists, chk, newList, newData, userId)

    // setPlaylists(prev => [...prev, newData])
  }

  const handleRelatedTracks = (data, trackId) => {
    data?.length ? setRelatedTracks(prev => ([...prev, { data: data, key: trackId }])) : null
    // console.log(relatedTracks, "relatedTracks!!")
  }

  const handleCountry = name => setCountry(name)

  const handleTopTracks = (data, countryCode) => {
    setTopTracks(prev => ([...prev, { data, countryCode }]))

    // console.log(data, "<<>>")
  }

  const handleSearchData = (type, query, data) => {
    const checkIfExistAlready = searchedData?.findIndex(item => item?.type === type && item.query === query && data?.length)
    // console.log(checkIfExistAlready, "checkIfExistAlready!!><><")
    setSearchedData(prev => checkIfExistAlready === -1 ? [...prev, { type, query, data }] : [...prev])
    // setSearchedData(prev => [...prev, { type, query, data }])
  }

  const clientQuery = new QueryClient()

  return (
    <SessionProvider session={pageProps.session}>
      {/* <AppContext.Provider value={{ handleRemovePlaylist, handleInitialUserPlaylist, handleRemoveFromPlaylist, handleAddToPlaylist, handlePlaylists, playlists, handleSearchData, searchedData, handleTopTracks, topTracks, handleCountry, country, handleRelatedTracks, relatedTracks }}> */}
      <DashboardContextProvider>
        <QueryClientProvider client={clientQuery}>
          <div className='flex gap-9'>
            <Navbar />
            <Component {...pageProps} />
          </div>
          <Footer />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </DashboardContextProvider>
      {/* </AppContext.Provider> */}
    </SessionProvider>
  )
}
