import { ACTIONS, dashboardReducer, initialState } from "@/reducers";
import { createContext, useContext, useReducer } from "react";

export const DashboardContext = createContext(initialState);

export const DashboardContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(dashboardReducer, initialState)

    const handleInitaialUserPlaylist = data => {
        dispatch({
            type: ACTIONS.UPDATE_PLAYLIST,
            payload: {
                playlists: data
            }
        })
    }

    const handleAddNewPlaylists = (newData, userId) => {
        const userPlaylists = state.playlists?.find(item => item.userId == userId)

        const chk = userPlaylists?.lists.findIndex(item => item.name === newData?.name)

        const newList = chk === -1 ? userPlaylists?.lists.push(newData) : [newData];

        let updatedList = null

        if (userPlaylists === undefined) {
            updatedList = state.playlists.concat({ userId, lists: [newData] })
        } else {
            if (chk === -1 && newList?.length) {
                updatedList = state.playlists.concat({ userId: userId, lists: newList })
            }
            // setPlaylists(prev => (chk === -1 && newList?.length) ? [...prev, { userId: userId, lists: newList }] : [...prev])
            // setPlaylists(prev => chk === -1 ? [...prev, {userId: userId, lists: newList}] : [...prev])
        }

        // dispatch({
        //     type: ACTIONS.UPDATE_PLAYLIST,
        //     payload: {
        //         playlists: updatedList
        //     }
        // })
        dispatchFunction(ACTIONS.UPDATE_PLAYLIST, updatedList)
    }

    const handleRemoveUserPlaylist = (userId, playlistName) => {
        const updatedList = state.playlists.map(item => {
            if (item?.userId == userId) {
                item.lists = item?.lists.filter(list => list.name !== playlistName)
            }
            return item
        })

        // dispatch({
        //     type: ACTIONS.UPDATE_PLAYLIST,
        //     payload: {
        //         playlists: updatedList
        //     }
        // })
        dispatchFunction(ACTIONS.UPDATE_PLAYLIST, updatedList)
    }

    const handleAddToPlaylist = (userId, playlistName, trackId) => {

        const updatedList = state.playlists.map(item => {
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

        // dispatch({
        //     type: ACTIONS.UPDATE_PLAYLIST,
        //     payload: {
        //         playlists: updatedList
        //     }
        // })
        dispatchFunction(ACTIONS.UPDATE_PLAYLIST, updatedList)
    }

    const handleRemoveFromPlaylist = (userId, playlistName, trackId) => {
        const updatedList = state.playlists.map(item => {
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

        // dispatch({
        //     type: ACTIONS.UPDATE_PLAYLIST,
        //     payload: {
        //         playlists: updatedList
        //     }
        // })
        dispatchFunction(ACTIONS.UPDATE_PLAYLIST, updatedList)
    }

    const handleSongRelatedTracks = (data, trackId) => {
        const updatedList = data?.length ? state.relatedTracks.concat({ data: data, key: trackId }) : state.relatedTracks

        // dispatch({
        //     type: ACTIONS.ADD_RELATED_TRACKS_FOR_SPECIFIC_SONG,
        //     payload: {
        //         relatedTracks: updatedList
        //     }
        // })
        dispatchFunction(ACTIONS.ADD_RELATED_TRACKS_FOR_SPECIFIC_SONG, updatedList)
    }

    const handleUpdateCountryName = (value) => {
        const updatedName = value ? value : state.country
        // dispatch({
        //     type: ACTIONS.UPDATE_COUNTRY,
        //     payload: {
        //         country: upatedName
        //     }
        // })
        dispatchFunction(ACTIONS.UPDATE_COUNTRY, updatedName)
    }

    const handleCountrySpecificTrends = (data, countryCode) => {
        const updatedList = data ? state.topTracks.concat({ data, countryCode }) : state.topTracks
        // dispatch({
        //     type: ACTIONS.ADD_TOP_TRACKS_FOR_SPECIFIC_COUNTRY,
        //     payload: {
        //         topTracks: updatedList
        //     }
        // })
        dispatchFunction(ACTIONS.ADD_TOP_TRACKS_FOR_SPECIFIC_COUNTRY, updatedList)
    }

    const handleSearchedInfoData = (type, query, data) => {
        const checkIfExistAlready = state.searchedData?.findIndex(item => item?.type === type && item.query === query && data?.length)
        // console.log(checkIfExistAlready, "checkIfExistAlready!!><><")
        const updatedList = checkIfExistAlready === -1 ? state.searchedData.concat({ type, query, data }) : state.searchedData

        // dispatch({
        //     type: ACTIONS.UPDATE_SEARCHED_INFO_DATA,
        //     payload: {
        //         searchedData: updatedList
        //     }
        // })
        dispatchFunction(ACTIONS.UPDATE_SEARCHED_INFO_DATA, updatedList)
    }

    const dispatchFunction = (type, updatedData) => {
        return dispatch({
            type: type,
            payload: {
                searchedData: updatedData
            }
        })
    }

    const value = {
        handleInitaialUserPlaylist,
        handleAddNewPlaylists,
        handleRemoveUserPlaylist,
        handleAddToPlaylist,
        handleRemoveFromPlaylist,
        handleInitaialUserPlaylist,
        handleCountrySpecificTrends,
        handleSongRelatedTracks,
        handleSearchedInfoData,
        handleUpdateCountryName,
        country: state.country,
        searchedData: state.searchedData,
        topTracks: state.topTracks,
        playlists: state.playlists,
        relatedTracks: state.relatedTracks
    }

    return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export const useDashboardCtx = () => {
    const ctx = useContext(DashboardContext);

    if(ctx === undefined) {
        throw new Error ("context is not found!!")
    }

    return ctx
}