import React from 'react'
import FixedVideoPlay from './FixedVideoPlay'
import { RevealText } from '@/components/shared/reveal-text'
import { FadeIn } from '@/components/shared/fade-in'
import VideoImageClipPath from './VideoImageClipPath'

const WorkVideo = () => {
  return (
    <section className="w-full py-12 flex flex-col items-center justify-center mx-auto gap-12  text-center">
      <div className="  w-[90vw] m-w-xl flex flex-col items-center mx-auto gap-4">
        <RevealText
          text="کیفت محصولات: تضمین مرغوبیت"
          id="work-video"
          className="text-xl pt-12 md:text-3xl font-bold uppercase  text-center"
          staggerAmount={0.2}
          duration={0.8}
        />
      </div>

      <FixedVideoPlay
        className="w-full hidden lg:block "
        videoUrl="/videos/v1.mp4"
      >
        <VideoImageClipPath
          clipPathId="desktop"
          className="bg-white/10 backdrop-blur-sm px-5 flex items-center justify-center h-full max-w-sm mx-auto py-auto aspect-square text-center"
        >
          <FadeIn>
            <p className="font-semibold">
              ما کیفیت محصولات ارائه شده را تضمین می‌کنیم و بدون اطلاع و استفاده
              از این محصولات شما را تشویق به استفاده از مواد غیر استاندارد و
              نامرغوب نخواهیم کرد.
            </p>
          </FadeIn>
        </VideoImageClipPath>
      </FixedVideoPlay>

      <FixedVideoPlay className="w-full lg:hidden" videoUrl="/videos/v2.mp4">
        <VideoImageClipPath
          clipPathId="mobile"
          className="bg-white/10 backdrop-blur-sm px-5 flex items-center justify-center h-full w-xs aspect-square text-center"
        >
          <FadeIn>
            <p className="font-semibold">
              ما کیفیت محصولات ارائه شده را تضمین می‌کنیم و بدون اطلاع و استفاده
              از این محصولات شما را تشویق به استفاده از مواد غیر استاندارد و
              نامرغوب نخواهیم کرد.
            </p>
          </FadeIn>
        </VideoImageClipPath>
      </FixedVideoPlay>
    </section>
  )
}

export default WorkVideo
