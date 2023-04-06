import mongoose from "mongoose"
const Schema = mongoose.Schema;

const Playlist = new Schema ({
    name: Schema.Types.String,
    tracks: Schema.Types.Array
});

// export default mongoose.model("playlist", Playlist)

const playlist = mongoose.models.playlist || mongoose.model("playlist", Playlist)

export default playlist;

// export default mongoose.models.playlist || mongoose.model("playlist", Playlist)

// export default mongoose.models.Playlist || mongoose.model("Playlist", Playlist)