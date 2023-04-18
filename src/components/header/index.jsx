import Image from 'next/image'
import React from 'react'
// import tagline from "../../../public/concom.jpg"
import tagline from "../../../public/musicnotes.jpg"

export const HeroContent = () => {
  return (
    // <Image className='w-full z-40' src={tagline} alt='poster' style={{height: "130px", objectFit: "fill"}} />
    <Image className='w-full z-40' src={tagline} alt='poster' style={{height: "180px", objectFit: "cover"}} />
    // <Image className='w-full z-40' src={poster} alt='poster' style={{height: "110px", backgroundSize: "cover", objectFit: "fill"}} />
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
