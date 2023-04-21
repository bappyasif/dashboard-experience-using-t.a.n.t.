import Head from 'next/head'
import { Inter } from 'next/font/google'
import Link from 'next/link'

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
        className='text-2xl w-full h-full text-neutral-950'
      >
        <h1 className='text-6xl mb-4 bg-stone-200 w-fit opacity-60'>Welcome :)</h1>
        <div
          className='flex flex-col gap-4 text-4xl'
        >
          <h2 className='bg-stone-200 w-fit opacity-70'>You can Search About <RenderLink name={"Songs"} path={"/search"} /> Or <RenderLink name={"Artists"} path={"/search"} /> </h2>
          <h2 className='bg-stone-200 w-fit opacity-70'>You can See <RenderLink name={"Trending Songs"} path={"/top-tracks"} /> By Country, If You Are Signed In</h2>
          <h2 className='bg-stone-200 w-fit opacity-80'>You can See Your Already Stored <RenderLink name={"Playlists"} path={"/playlists"} />, If You Are Signed In</h2>
          <h2 className='bg-stone-200 w-fit opacity-90'>You can See Your <RenderLink name={"Dashboard"} path={"/dashboard"} />, If You Are Signed In</h2>
        </div>
      </main>
    </>
  )
}

export const RenderLink = ({name, path}) => {
  return (
    <Link 
      className='bg-stone-400 text-zinc-950 px-4 rounded-full w-fit
      hover:bg-slate-600 hover:text-violet-200' 
      href={path}
      >
        {name}      
      </Link>
  )
}
