export const initialState = {
    topTracks: [],
    relatedTracks: [],
    country: "",
    searchedData: [],
    playlists: []
}

export const ACTIONS = {
    REMOVE_PLAYLIST: "remove_playlist",
    ADD_PLAYLIST: "add_playlist",
    UPDATE_COUNTRY: "update_country",
    UPDATE_PLAYLIST: "update_playlist",
    REMOVE_SONG_FROM_PLAYLIST: "remove_song_from_playlist",
    ADD_SONG_INTO_PLAYLIST: "add_song_into_playlist",
    INITIAL_USER_SONG_PLAYLIST: "initial_user_song_playlist",
    ADD_RELATED_TRACKS_FOR_SPECIFIC_SONG: "add_related_tracks_for_specific_song",
    ADD_TOP_TRACKS_FOR_SPECIFIC_COUNTRY: "add_top_tracks_for_specific_country",
    UPDATE_SEARCHED_INFO_DATA: "update_searched_info_data"
}

export const dashboardReducer = (state, action) => {
    const { type, payload } = action

    switch (type) {
        // case ACTIONS.ADD_PLAYLIST:
        //     // return {
        //     //     ...state,
        //     //     playlists: payload.playlists
        //     // }
        // case ACTIONS.REMOVE_PLAYLIST:
        //     // return {
        //     //     ...state,
        //     //     playlists: payload.playlists
        //     // }
        // case ACTIONS.ADD_SONG_INTO_PLAYLIST:
        //     // return {
        //     //     ...state,
        //     //     playlists: payload.playlists
        //     // }
        // case ACTIONS.REMOVE_SONG_FROM_PLAYLIST:
        //     // return {
        //     //     ...state,
        //     //     playlists: payload.playlists
        //     // }
        // case ACTIONS.INITIAL_USER_SONG_PLAYLIST:
        //     // return {
        //     //     ...state,
        //     //     playlists: payload.playlists
        //     // }
        case ACTIONS.UPDATE_PLAYLIST:
            return {
                ...state,
                playlists: payload.playlists
            }
        case ACTIONS.ADD_TOP_TRACKS_FOR_SPECIFIC_COUNTRY:
            return {
                ...state,
                topTracks: payload.topTracks
            }
        case ACTIONS.ADD_RELATED_TRACKS_FOR_SPECIFIC_SONG:
            return {
                ...state,
                relatedTracks: payload.relatedTracks
            }
        case ACTIONS.UPDATE_SEARCHED_INFO_DATA:
            return {
                ...state,
                searchedData: payload.searchedData
            }
        case ACTIONS.UPDATE_COUNTRY:
            return {
                ...state,
                country: payload.country
            }
        default:
            throw new Error(`No case found for type: ${type} in reducer`)
    }
}