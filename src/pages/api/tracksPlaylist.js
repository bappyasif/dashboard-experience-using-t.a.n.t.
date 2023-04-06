import Playlist from "@/model/tracksPlaylist";
import userPlaylist from "@/model/userPlaylist";
import connectMongo from "@/utils/connectMongo";

export default async function handler (req, res) {
    try {
        console.log("Connecting DB")
        await connectMongo();
        console.log("Connectd DB")

        console.log("Creating DB")
        // const test = Playlist.create({
        //     name: "test",
        //     tracks: ["1", "2"]
        // })

        const test3 = new userPlaylist({
            name: "test2",
            userId: "user1"
        })

        const test2 = new Playlist({
            name: "test",
            tracks: ["1", "2"]
        })

        test2.save()
        test3.save()
        console.log("Created DB")

        const lists = await userPlaylist.find({userId: "user1"})
        res.json({test2, test3, lists})
    } catch (err) {
        console.log(err);
        res.json({err})
    }
}