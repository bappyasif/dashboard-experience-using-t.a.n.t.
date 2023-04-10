// import DBConnect from "@/lib/mongodb";
// import clientPromise from "@/lib/mongodb";
// import playlist from "@/model/playlist"
import connectMongo from "../../utils/connectMongo"
import userPlaylist from "@/model/userPlaylist";
import { getSession } from "next-auth/react";

// make sure database is connected otherwise this will face buffereing time error
export default async function handler (req, res) {
    // DBConnect().then(() => console.log("db running")).catch(err => console.log(err))

    // await clientPromise

    // clientPromise.then(() => console.log("Database connected!")).catch(err => console.log(err));

    const session = await getSession({req})

    if(!session) {
        console.log("unauthorized user!!")
        return res.status(401).json({msg: "un-authorized user"})
    }

    await connectMongo();

    if(req.method === "POST") {
        const {name, userId} = req.body;

        const test = new userPlaylist({
            name: name, 
            userId: userId
        })
    
        test.save()

        return res.status(200).json({test})

    } else if (req.method === "PUT") {
        const { userId, name, trackId} = req.body
        const userPlaylists = await userPlaylist.findOne({name: name, userId: userId})
        
        if(userPlaylists?.tracks?.length === undefined || userPlaylists?.tracks?.length === 0) {
            userPlaylists.tracks = [trackId]
        } else if (userPlaylists?.tracks?.length) {
            const chk = userPlaylists.tracks.findIndex(val => val == trackId)
            if(chk === -1) {
                userPlaylists.tracks.push(trackId)
            }
        }

        userPlaylist.findByIdAndUpdate(userPlaylists._id, userPlaylists, {}).then(() => console.log("updated!!")).catch(err=>console.log(err))
    } else if(req.method === "GET") {
        const {userId} = req.query;

        userPlaylist.find({userId: userId})
        .then(results => {
            const lists = results?.map(item => {
                const {name, tracks} = item
                return {name, tracks}
            })
            return res.json({result: {userId, lists}, msg: "result modified!!"})
        }).catch(err => console.log(err))
    } else if (req.method === "DELETE") {
        const {userId, name, trackId, delPlist} = req.body;
        
        if(delPlist) {
            userPlaylist.findOneAndDelete({name: name})
            .then(() => console.log("Playlist deleted....")).catch(err => console.log(err))
        } else {
            userPlaylist.findOne({name: name}).then(doc => {
                const newList = doc?.tracks.filter(v => v != trackId)
                doc.tracks = newList;
                userPlaylist.findByIdAndUpdate(doc._id, doc, {})
                .then(() => console.log("track deleted")).catch(()=> console.log("after delete update failed"))
            }).catch(err => console.log(err))
        }
        
        res.status(200).json({msg: "'t is levend"})
    } else {
        res.status(200).json({msg: "'t is levend"})
    }
}