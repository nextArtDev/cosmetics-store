'use client'
import { TransitionLink } from '@/components/home/shared/TransitionLink'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { FC } from 'react'
import ClipPathImage from './clip-path'
import SmallCard from './small-card'
import Socials from './socials'
import StatsCarouselcount from './state-carousel'

type Product = {
  id: string
  name: string
  slug: string
  brand: string
  rating: number
  sales: number
  numReviews: number
  isSale: boolean
  saleEndDate: string | null
  images: { url: string }[]
  variantImages: { url: string }[]
  sizes: {
    size: string
    quantity: number
    price: number
    discount: number
  }[]
  colors: { name: string }[]
  category?: { name: string; url: string }
  subCategory?: { name: string; url: string }
}

interface ClipPathCarouselProps {
  product?: Product
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ClipPathCarousel: FC<ClipPathCarouselProps> = ({ product }) => {
  //   const imageUrls = React.useMemo(
  //     () => [
  //       ...(product.images?.map((img) => img.url) || []),
  //       ...(product.variantImages?.map((img) => img.url) || []),
  //     ],
  //     [product.images, product.variantImages]
  //   )

  //   const [api, setApi] = React.useState<CarouselApi>()
  //   const [current, setCurrent] = React.useState(0)
  //   const [count, setCount] = React.useState(0)

  //   React.useEffect(() => {
  //     if (!api) return

  //     setCount(api.scrollSnapList().length)
  //     setCurrent(api.selectedScrollSnap())

  //     api.on('select', () => {
  //       setCurrent(api.selectedScrollSnap())
  //     })
  //   }, [api])
  return (
    <section className="relative overflow-x-hidden w-full mx-auto max-w-sm h-full  ">
      {/* <TransitionLink href={`/products/${product.slug}`} className="my-6"> */}
      <TransitionLink href={`/`} className="my-4 relative w-full h-full">
        <Carousel
          opts={{
            align: 'start',
            direction: 'rtl',
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          dir="rtl"
          //   setApi={setApi}
          className="w-full h-full"
        >
          <div className="absolute inset-0 right-[14%]   -top-20">
            <StatsCarouselcount
              title="CREATE STUNNING INTERFACES WITH SCROLLX UI COMPONENTS"
              stats={[
                {
                  value: 40,
                  suffix: '+',
                  label: 'محصول آرایشی،بهداشتی و زیبایی',
                },
                {
                  value: 4,
                  suffix: 'K+',
                  label: 'خریدار محصولات',
                },
                {
                  value: 98,
                  suffix: '%',
                  label: 'رضایت مصرف‌کننده',
                },
              ]}
              className="!w-[60%] !h-[80px]"
              cardClassName="!p-1 rounded-t-3xl "
            />
          </div>
          <div className="absolute w-full h-fit right-2 top-0.5  ">
            <Socials />
          </div>
          <div className="absolute w-[44%] h-[200px] right-2 top-[62%] z-20 ">
            <SmallCard />
          </div>
          <div className="absolute w-full h-fit  top-2 -left-[81%] ">
            <Button className=" px-3.5 rounded-br-2xl bg-amber-500">
              ثبت نام
            </Button>
          </div>
          <div className="absolute pr-2 pt-0.5 left-0 font-semibold  bottom-0.5 max-w-1/2 w-[180px] text-justify">
            <p className="inline font-semibold text-red-500">نمایندگی فروش</p>
            <p className="inline p-0.5 text-amber-900/60">
              انواع لوازم آرایشی، بهداشتی و زیبایی معتبر و ارسال به سراسر کشور.
            </p>
          </div>

          <ClipPathImage>
            <CarouselContent className=" ">
              {/* {imageUrls.map((url) => ( */}
              {[
                '/images/p1.webp',
                '/images/06.webp',
                '/images/p2.webp',
                '/images/03.webp',
              ].map((url) => (
                <CarouselItem key={url}>
                  <Card className="h-full w-full border-none rounded-none bg-[#eceae8] p-0 ">
                    <CardContent className="relative flex  items-center justify-center p-0 h-[80vh] ">
                      <Image
                        unoptimized
                        src={url || '/images/fallback-image.webp'}
                        // alt={product.name}
                        alt=""
                        fill
                        className="object-cover  "
                        // sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </ClipPathImage>
        </Carousel>

        {/* {count > 1 && (
          <div className="absolute -bottom-[1px] left-0.25 right-0.25 flex items-center gap-x-0.5 z-10">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'h-0.25 md:h-[1.5px] flex-1 rounded-full',
                  current === index
                    ? 'bg-muted-foreground'
                    : 'bg-muted-foreground/30',
                  'transition-colors duration-200 ease-in-out'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )} */}
      </TransitionLink>
    </section>
  )
}

export default ClipPathCarousel
