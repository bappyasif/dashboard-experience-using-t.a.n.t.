import React from 'react'
import footer from "../../../public/footer.jpg"
import Image from 'next/image'

export const Footer = () => {
  return (
    <div 
      className='text-4xl bg-blue-200 py-0 absolute bottom-0 min-w-full text-center z-10'
      style={{
        // backgroundImage: `url(${"/footer.jpg"})`,
        // backgroundSize: "contain"
        height: "150px"
      }}
      >
        {/* Footer */}
        <Image className='w-full' src={footer} alt='footer' style={{height: "150px"}} />
      </div>
  )
}
