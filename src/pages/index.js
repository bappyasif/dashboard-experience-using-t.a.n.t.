import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import gv from "../../public/gv.jpg"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Music Trend And Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className='text-2xl w-full h-full z-10'
        style={{
          // backgroundImage: `url(${"/concert.jpg"})`
        }}
      >
        {/* <Image
          className='w-full z-0 absolute'
          sizes='small'
          src={gv}
          alt='poster'
          style={{zIndex: "0", height: "100%"}} 
        /> */}
        <h1 className='text-6xl my-4'>Welcome :)</h1>
        <div
          className='flex flex-col gap-4'
        >
          <h2>You can Search About <Link className='bg-stone-200 px-4 rounded-full w-fit' href={"/search"}>Songs</Link> Or <Link className='bg-stone-200 px-4 rounded-full w-fit' href={"/search"}>Artists</Link></h2>
          <h2>You can See Trending <Link className='bg-stone-200 px-4 rounded-full w-fit' href={"/top-tracks"}>Songs</Link> By Country, If You Are Signed In</h2>
          <h2>You can See Your Already Stored <Link className='bg-stone-200 px-4 rounded-full w-fit' href={"/playlists"}>Playlists</Link>, If You Are Signed In</h2>
          <h2>You can See Your <Link className='bg-stone-200 px-4 rounded-full w-fit' href={"/dashboard"}>Dashboard</Link>, If You Are Signed In</h2>
        </div>
      </main>
    </>
  )
}
