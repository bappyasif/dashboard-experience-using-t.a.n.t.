import Image from 'next/image'
import React from 'react'
import poster from "../../../public/poster.jpg"

export const HeroContent = () => {
  return (
    <Image className='w-full z-40' src={poster} alt='poster' style={{height: "220px"}} />
    // <div
    //     className='h-2/4'
    //     style={{
    //         // backgroundImage: `url(${"/poster.jpg"})`,
    //         // backgroundSize: "contain",
    //         // backgroundRepeat: "no-repeat",
    //         maxHeight: "220px"
    //     }}
    // >
    //     <Image className='w-full z-20' src={poster} alt='poster' style={{height: "220px"}} />
    // </div>
  )
}
