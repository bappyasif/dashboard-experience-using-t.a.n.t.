import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { AiOutlineSearch, AiOutlineLogin, AiOutlineLogout, AiOutlineDashboard, AiOutlineHome, AiOutlineRise, AiOutlineDeploymentUnit, AiOutlineRadarChart } from "react-icons/ai"

export const Navbar = () => {
    const { status } = useSession();

    const renderNavs = () => navs.map(item => <RenderNav key={item.name} item={item} status={status} />)

    return (
        <nav className='flex flex-col gap-1'>
            {renderNavs()}
        </nav>
    )
}

const RenderNav = ({ item }) => {
    const { name, path, icon } = item;
    const { status } = useSession()

    return (
        status === "unauthenticated" && name !== "Top Tracks" && name !== "Playlists" && name !== "Dashboard" && name !== "Sign Out" && name !== "Detect Song"
            ||
            status === "authenticated" && name !== "Sign In"
            ?
            < Link href={path} className="text-2xl bg-zinc-400 p-2 pr-11 flex gap-2 items-center rounded-lg" >
                <span>{name}</span>
                <span>{icon}</span>
            </Link >
            : null
    )
}

const navs = [
    {
        name: "Home",
        path: "/",
        icon: <AiOutlineHome />
    },
    {
        name: "Detect Song",
        path: "/detect-song",
        icon: <AiOutlineRadarChart />
    },
    {
        name: "Top Tracks",
        path: "/top-tracks",
        icon: <AiOutlineRise />
    },
    {
        name: "Playlists",
        path: "/playlists",
        icon: <AiOutlineDeploymentUnit />
    },
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: <AiOutlineDashboard />
    },
    {
        name: "Search",
        path: "/search",
        icon: <AiOutlineSearch />
    },
    {
        name: "Sign In",
        path: "/api/auth/signin",
        icon: <AiOutlineLogin />
    },
    {
        name: "Sign Out",
        path: "/api/auth/signout",
        icon: <AiOutlineLogout />
    }
]