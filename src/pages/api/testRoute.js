import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"

const { getSession } = require("next-auth/react")

const handler = async (req, res) => {
    // const session = await getSession({req})
    const session = await getServerSession(req, res, authOptions)

    if(req.method === "GET")  {
        console.log("GET", session)
        return res.status(200).json({msg: "success"})
    } else if(req.method === "DELETE")  {
        console.log("DELETE", session)
        return res.status(200).json({msg: "success"})
    }

    return res.status(400).json({msg: "failed"})
}

export default handler;