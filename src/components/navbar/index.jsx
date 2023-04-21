import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch, AiOutlineLogin, AiOutlineLogout, AiOutlineDashboard, AiOutlineHome, AiOutlineRise, AiOutlineDeploymentUnit, AiOutlineRadarChart } from "react-icons/ai"

export const Navbar = () => {
    const [activeNow, setActiveNow] = useState("");
    const { status } = useSession();

    const handleActive = name => setActiveNow(name);

    const router = useRouter()

    const handleWhichRouteActive = () => {
        const getPathName = router.pathname;
        const findName = navs.find(item => item.path === getPathName)

        if (findName?.name) {
            handleActive(findName.name)
        }
        // console.log(findName, getPathName)
    }

    useEffect(() => {
        // console.log(router.pathname, router.pathname.split("/"))
        handleWhichRouteActive()
    }, [router.pathname])

    const renderNavs = () => navs.map(item => <RenderNav key={item.name} activeNow={activeNow} handleActive={handleActive} item={item} status={status} />)

    return (
        <nav
            className='flex flex-col gap-1 min-h-full z-10'
        // style={{
        //     minHeight: "100vh"
        // }}
        >
            {renderNavs()}
        </nav>
    )
}

const RenderNav = ({ item, handleActive, activeNow }) => {
    const { name, path, icon } = item;
    const { status } = useSession()

    return (
        status === "unauthenticated" && name !== "Top Tracks" && name !== "Playlists" && name !== "Dashboard" && name !== "Sign Out" && name !== "Detect Song"
            ||
            status === "authenticated" && name !== "Sign In"
            ?
            < Link
                href={path}
                className={`text-gray-${activeNow === name ? "600" : "800"} 
                ${activeNow == name ? "bg-white" : "bg-zinc-400"} 
                text-2xl p-2 pr-11 flex gap-2 items-center rounded-lg min-w-max
                hover:bg-slate-${activeNow !== name ? "600" : ""} 
                hover:${activeNow !== name ? "text-white" : ""}
                `
                }
                onClick={() => handleActive(name)}
            >
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
    // {
    //     name: "Detect Song",
    //     path: "/detect-song",
    //     icon: <AiOutlineRadarChart />
    // },
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