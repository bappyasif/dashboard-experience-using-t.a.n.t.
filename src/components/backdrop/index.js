import Image from 'next/image'
import React from 'react'
import gv from "../../../public/gv.jpg"

export const BackdropImage = () => {
    return (
        <div
            className='z-20'
            style={{
                backgroundImage: `url(${"/gv.jpg"})`,
                backgroundSize: "contain",
            }}
        >

        </div>

        // <Image className='w-full h-full'
        //     src={gv}
        //     alt='backdrop'
        //     style={{ 
        //         zIndex: "0", 
        //         // height: "100%" 
        //     }}
        // />
    )
}
