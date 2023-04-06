import {Schema, model, models} from "mongoose"

const playlistSchema = new Schema({
    name: Schema.Types.String,
    // tracks: {
    //     type: Array,
    //     required: true,
    //     unique: true
    // },
    tracks: Schema.Types.Array
})

const Playlist = models.Playlist || model("Playlist", playlistSchema);

export default Playlist