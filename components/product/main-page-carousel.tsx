'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import React, { useRef } from 'react'
import { HomepageProduct } from '@/lib/types/home'
import { FadeIn } from '../shared/fade-in'
import { useInView } from 'framer-motion'
import Autoplay from 'embla-carousel-autoplay'
import { TransitionLink } from '../home/shared/TransitionLink'
import ProductClipPath from './product-clip-path'

export type item = {
  id: string
  link: string
  category: string
  title: string
  price: number
  imageSrc: string
}

type MainPageCarousel = {
  items: Partial<HomepageProduct>[]
}

export default function MainPageCarousel({ items }: MainPageCarousel) {
  const carouselRef = useRef(null)

  const isInView = useInView(carouselRef, { once: true, amount: 0.3 })
  return (
    <Carousel
      opts={{
        align: 'start',
        direction: 'rtl',
        loop: true,
      }}
      plugins={
        isInView
          ? [
              Autoplay({
                delay: 3000,
              }),
            ]
          : []
      }
      dir="rtl"
      className="w-full"
      ref={carouselRef}
    >
      <CarouselContent className="-ml-1 md:-ml-2 xl:-ml-4">
        {items.map((item, i) => (
          <CarouselItem
            key={item.id}
            className="pl-1 basis-1/2 md:pl-2 md:basis-1/3 lg:basis-1/4 xl:pl-4 xl:basis-1/5  "
          >
            <FadeIn
              className="translate-y-5"
              vars={{ delay: 0.2 * i, duration: 0.3, ease: 'sine.inOut' }}
            >
              <TransitionLink
                href={`/products/${item.slug}`}
                className="flex flex-col border-none rounded-none bg-transparent gap-2"
              >
                {!!item.images && (
                  <figure className="relative w-full aspect-square bg-transparent border-none rounded-none">
                    <ProductClipPath
                      // Pass a unique ID for each product's clipPath
                      clipPathId={`clipPath-${item.id}`}
                      discounted={!!item.sizes?.map((s) => s.discount)?.[0]}
                    >
                      <Image
                        unoptimized
                        src={
                          item.images.map((img) => img.url)[0] ||
                          '/images/fallback-image.webp'
                        }
                        fill
                        alt={item.name!}
                        className="object-cover mix-blend-darken"
                      />
                    </ProductClipPath>

                    {!!item.sizes && (
                      <>
                        {item.sizes.map((size, i) => (
                          <div key={i} className="flex items-center gap-1">
                            {!!size.discount && (
                              <p className="text-red-500 rounded-md absolute top-0 left-0.5 bg-orange-500/20 px-2.5 py-1.25 backdrop-blur-sm border border-l-orange-500">
                                %{size.discount}
                              </p>
                            )}
                            <p className="text-black/90 w-1/2 rounded-md absolute bottom-0.5 right-0 bg-orange-500/10 flex items-center justify-center py-1 backdrop-blur-sm border border-r-orange-500">
                              {size.price - size.price * (size.discount / 100)}{' '}
                              تومان
                            </p>
                          </div>
                        ))}
                      </>
                    )}
                  </figure>
                )}
                <article className="flex  flex-row-reverse gap-1 justify-between py-1 px-2 text-pretty text-xs md:text-sm lg:text-base">
                  <p className="font-semibold">{item?.brand}</p>
                  <p className="font-bold">{item.name}</p>
                  {/* {!!item.sizes && (
                    <>
                      {item.sizes.map((size, i) => (
                        <div key={i} className="flex items-center gap-1">
                          {!!size.discount && (
                            <p className="text-red-500">
                              {size.price - size.price * (size.discount / 100)}{' '}
                              تومان
                            </p>
                          )}
                          <p
                            className={cn('', size.discount && 'line-through')}
                          >
                            {size.price} تومان
                          </p>
                        </div>
                      ))}
                    </>
                  )} */}
                </article>
              </TransitionLink>
            </FadeIn>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 left-2" />
      <CarouselNext className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 right-4" />
    </Carousel>
  )
}
