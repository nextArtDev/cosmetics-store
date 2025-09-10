import { ReactNode } from 'react'

function VideoClipPath({
  children,

  clipPathId, // Add this new prop
}: {
  children: ReactNode

  clipPathId?: string // Add this type definition
}) {
  return (
    <section className="relative w-full h-full">
      {/* SVG for clipPath definition with unique ID */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="clip-goey5" clipPathUnits={'objectBoundingBox'}>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.0249688 0C0.0111789 0 0 0.0112775 0 0.0251889V0.851385C0 0.865297 0.0111789 0.876574 0.0249688 0.876574H0.179775V0.974811C0.179775 0.988723 0.190954 1 0.204744 1H0.975031C0.988821 1 1 0.988723 1 0.974811V0.157431C1 0.143519 0.988821 0.132242 0.975031 0.132242H0.810237V0.0251889C0.810237 0.0112775 0.799058 0 0.785268 0H0.0249688Z"
              fill="#D9D9D9"
            />
          </clipPath>
        </defs>
      </svg>

      {/* Container with clipPath applied using the unique ID */}
      <div className="relative w-full h-full">
        <figure style={{ clipPath: 'url(#clip-goey5)' }}>{children}</figure>
      </div>
    </section>
  )
}

export default VideoClipPath
