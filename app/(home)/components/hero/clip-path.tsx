import React, { ReactNode } from 'react'
import Image from 'next/image'
import heroImage from '../../../../public/images/hero-image.webp'

function ClipPathImage({ children }: { children: ReactNode }) {
  return (
    <section className="relative w-full h-full  ">
      {/* Visible SVG for clipPath definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="differentone23" clipPathUnits="objectBoundingBox">
            {/* Convert path to normalized coordinates (0-1) */}
            <path d="M0.317,0.074 H0.082 C0.082,0.074 0.002,0.074 0.002,0.149 L0.002,0.905 C0.002,0.930 0.002,1 0.107,1 H0.389 C0.429,1 0.491,1 0.491,0.905 C0.491,0.810 0.558,0.832 0.558,0.832 C0.558,0.832 0.826,0.830 0.888,0.830 C0.950,0.830 1,0.830 1,0.720 V0.172 C1,0.095 0.948,0.104 0.888,0.104 H0.833 C0.764,0.104 0.833,0.002 0.717,0.002 H0.429 C0.317,0.002 0.366,0.074 0.317,0.074 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Container with clip-path applied */}
      <div className="relative w-full h-full">
        <div
          style={{ clipPath: 'url(#differentone23)' }}
          className="w-full h-full"
        >
          {/* <Image
            src={heroImage}
            alt="Hero image with custom clip path"
            fill
            className="object-cover"
            placeholder="blur"
          /> */}
          {children}
        </div>
      </div>
    </section>
  )
}

export default ClipPathImage
