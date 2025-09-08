import { ReactNode } from 'react'

function ProductClipPath({
  children,
  discounted = false,
  clipPathId, // Add this new prop
}: {
  children: ReactNode
  discounted: boolean
  clipPathId: string // Add this type definition
}) {
  return (
    <section className="relative w-full h-full">
      {/* SVG for clipPath definition with unique ID */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id={clipPathId} clipPathUnits="objectBoundingBox">
            <path
              d={
                discounted
                  ? 'M0.004,0.162 H0.004 V0.942 C0.004,0.979,0.042,1,0.062,0.997 H0.47 C0.509,0.997,0.5,0.956,0.5,0.896 C0.5,0.864,0.519,0.86,0.527,0.864 C0.654,0.864,0.918,0.865,0.958,0.864 C0.998,0.863,1,0.836,0.996,0.823 C0.996,0.589,0.994,0.13,0.996,0.076 C0.999,0.023,1.004,0.004,0.957,0.006 C0.788,0.003,0.297,0.005,0.26,0.006 C0.222,0.006,0.223,0.04,0.223,0.04 L0.223,0.083 C0.223,0.112,0.202,0.123,0.188,0.119 H0.042 C0.004,0.119,0.001,0.148,0.004,0.162 Z'
                  : 'M0.003,0.150 H0.003 V0.941 C0.003,0.978,0.041,1,0.061,0.997 H0.469 C0.508,0.997,0.5,0.956,0.5,0.895 C0.5,0.863,0.518,0.858,0.527,0.863 C0.654,0.863,0.918,0.864,0.958,0.863 C0.998,0.862,0.999,0.834,0.996,0.821 C0.995,0.583,0.994,0.117,0.996,0.063 C0.998,0.009,0.996,0.002,0.949,0.004 H0.259 H0.061 C0.042,0,0.003,0.006,0.003,0.063 V0.150 Z'
              }
            />
          </clipPath>
        </defs>
      </svg>

      {/* Container with clip-path applied using the unique ID */}
      <div className="relative w-full h-full">
        <div
          style={{ clipPath: `url(#${clipPathId})` }}
          className="w-full h-full"
        >
          {children}
        </div>
      </div>
    </section>
  )
}

export default ProductClipPath
