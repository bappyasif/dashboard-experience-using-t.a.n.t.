import {Schema, model, models} from "mongoose"

const UserPlaylist = new Schema({
    userId: Schema.Types.String,
    name: Schema.Types.String,
    tracks: Schema.Types.Array
});

const userPlaylist = models.userPlaylist || model("userPlaylist", UserPlaylist)

export default userPlaylist;