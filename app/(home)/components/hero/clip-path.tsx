import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

function ClipPathImage({ children }: { children: ReactNode }) {
  return (
    <section className="relative w-full h-full  ">
      {/* Visible SVG for clipPath definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="differentone23" clipPathUnits="objectBoundingBox">
            {/* Convert path to normalized coordinates (0-1) */}
            {/* <path d="M0.317,0.074 H0.082 C0.082,0.074 0.002,0.074 0.002,0.149 L0.002,0.905 C0.002,0.930 0.002,1 0.107,1 H0.389 C0.429,1 0.491,1 0.491,0.905 C0.491,0.810 0.558,0.832 0.558,0.832 C0.558,0.832 0.826,0.830 0.888,0.830 C0.950,0.830 1,0.830 1,0.720 V0.172 C1,0.095 0.948,0.104 0.888,0.104 H0.833 C0.764,0.104 0.833,0.002 0.717,0.002 H0.429 C0.317,0.002 0.366,0.074 0.317,0.074 Z" /> */}

            <path d="M0.679,0.066 H0.914 C0.997,0.066,0.997,0.066,0.997,0.159 V0.913 C0.997,0.992,0.997,0.998,0.893,0.998 H0.549 C0.5,0.998,0.5,0.979,0.5,0.932 C0.5,0.884,0.448,0.884,0.448,0.884 H0.114 C0.002,0.884,0.002,0.895,0.002,0.768 V0.159 C0.002,0.092,0.002,0.086,0.114,0.086 H0.170 C0.239,0.086,0.170,0.002,0.285,0.002 H0.572 C0.678,0.002,0.630,0.066,0.679,0.066 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Container with clipPath applied */}
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
export function ClipPathMessage({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section className="relative w-full h-full  ">
      {/* Visible SVG for clipPath definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="message-clip-path" clipPathUnits="objectBoundingBox">
            {/* Convert path to normalized coordinates (0-1) */}
            {/* <path d="M0.317,0.074 H0.082 C0.082,0.074 0.002,0.074 0.002,0.149 L0.002,0.905 C0.002,0.930 0.002,1 0.107,1 H0.389 C0.429,1 0.491,1 0.491,0.905 C0.491,0.810 0.558,0.832 0.558,0.832 C0.558,0.832 0.826,0.830 0.888,0.830 C0.950,0.830 1,0.830 1,0.720 V0.172 C1,0.095 0.948,0.104 0.888,0.104 H0.833 C0.764,0.104 0.833,0.002 0.717,0.002 H0.429 C0.317,0.002 0.366,0.074 0.317,0.074 Z" /> */}

            <path d="M0.417,0 v0 c0.23,0,0.417,0.17,0.417,0.379 s-0.187,0.379,-0.417,0.379 c-0.022,0,-0.044,-0.002,-0.065,-0.005 c-0.089,0.1,-0.193,0.118,-0.296,0.121 v-0.025 c0.056,-0.031,0.101,-0.086,0.101,-0.15 c0,-0.009,-0.001,-0.018,-0.002,-0.026 c-0.094,-0.07,-0.154,-0.176,-0.154,-0.295 c0,-0.209,0.187,-0.379,0.417,-0.379 M0.865,0.85 c0,0.055,0.032,0.102,0.08,0.129 v0.021 c-0.09,-0.002,-0.172,-0.018,-0.249,-0.104 c-0.018,0.003,-0.037,0.004,-0.056,0.004 c-0.083,0,-0.159,-0.025,-0.22,-0.067 c0.126,0,0.244,-0.046,0.334,-0.128 c0.045,-0.041,0.081,-0.09,0.106,-0.144 c0.027,-0.057,0.04,-0.119,0.04,-0.182 c0,-0.01,0,-0.02,-0.001,-0.03 c0.063,0.059,0.102,0.138,0.102,0.226 c0,0.102,-0.052,0.193,-0.134,0.253 c-0.001,0.007,-0.002,0.015,-0.002,0.022" />
          </clipPath>
        </defs>
      </svg>

      {/* Container with clipPath applied */}
      <div className={cn('relative w-full h-full', className)}>
        <div style={{ clipPath: 'url(#message-clip-path)' }}>{children}</div>
      </div>
    </section>
  )
}
