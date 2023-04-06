import { ACTIONS, dashboardReducer, initialState } from "@/reducers";
import { createContext, useReducer } from "react";

export const dashboardContext = createContext(initialState);

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

    const handlePlaylists = (newData, userId) => {
        const userPlaylists = state.playlists?.find(item => item.userId == userId)
 
        const chk = userPlaylists?.lists.findIndex(item => item.name === newData?.name)
 
        const newList = chk === -1 ? userPlaylists?.lists.push(newData) : [newData];

        const updatedList = null

        if (userPlaylists === undefined) {
            updatedList = state.playlists.concat({ userId, lists: [newData] })
        } else {
            if(chk === -1 && newList?.length) {
                updatedList = state.playlists.concat({ userId: userId, lists: newList })
            }
            // setPlaylists(prev => (chk === -1 && newList?.length) ? [...prev, { userId: userId, lists: newList }] : [...prev])
            // setPlaylists(prev => chk === -1 ? [...prev, {userId: userId, lists: newList}] : [...prev])
        }

        dispatch({
            type: ACTIONS.UPDATE_PLAYLIST,
            payload: {
                playlists: updatedList
            }
        })
    }
}