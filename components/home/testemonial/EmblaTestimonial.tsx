'use client'

import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { cn, formatTimeToNow } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ClipPathMessage } from '@/app/(home)/components/hero/clip-path'
import { StarRating } from './StarRating'

interface TestimonialProps {
  testimonials?: {
    title: string
    description: string
    user: string
    rating: number
    createdAt: Date
  }[]
  title?: string
  subtitle?: string
  autoplaySpeed?: number
  className?: string
  direction?: 'rtl' | 'ltr'
}

export default function EmblaTestimonial({
  testimonials,

  autoplaySpeed = 3000,
  className,
  direction = 'ltr',
}: TestimonialProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: true,
    direction: direction,
  })

  useEffect(() => {
    if (!emblaApi) return

    const autoplay = setInterval(() => {
      emblaApi.scrollNext()
    }, autoplaySpeed)

    return () => {
      clearInterval(autoplay)
    }
  }, [emblaApi, autoplaySpeed])

  //   const allTestimonials = [...testimonials, ...testimonials]

  return (
    <section
      dir={direction}
      className={cn('relative overflow-hidden py-16 md:py-24', className)}
    >
      {/* <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.2),transparent_60%)]" />
        <div className="bg-primary/5 absolute top-1/4 left-1/4 h-32 w-32 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute right-1/4 bottom-1/4 h-40 w-40 rounded-full blur-3xl" />
      </div> */}

      <div className=" mx-auto ">
        {/* Testimonials carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials?.map((testimonial, index) => (
              <div
                key={`${testimonial.title}-${index}`}
                className=" flex justify-center px-4 py-12"
              >
                {/* <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="  border-border from-secondary/20 to-card relative h-full w-fit rounded-2xl border bg-gradient-to-b p-6 shadow-md backdrop-blur-sm overflow-hidden"
                > */}
                <ClipPathMessage className="rotate-[15deg]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className=" relative  w-[350px] h-full aspect-square overflow-hidden"
                  >
                    {/* Enhanced decorative gradients */}
                    {/* <div className="from-primary/15 to-card absolute -top-5 -left-5 -z-10 h-40 w-40 rounded-full bg-gradient-to-b blur-md" />
                  <div className="from-primary/10 absolute -right-10 -bottom-10 -z-10 h-32 w-32 rounded-full bg-gradient-to-t to-transparent opacity-70 blur-xl" /> */}

                    <div
                      className="absolute inset-0 z-0"
                      style={{
                        background: `
        radial-gradient(ellipse 80% 60% at 70% 20%, rgba(250, 145, 60, 0.85), transparent 68%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.75), transparent 68%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(228, 0, 75, 0.98), transparent 68%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba( 255, 215, 170, 0.3), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
                      }}
                    />
                    {/* <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                      viewport={{ once: true }}
                      className="text-primary mb-4"
                    >
                      <div className="relative">
                        <Quote className="h-10 w-10 -rotate-180" />
                      </div>
                    </motion.div> */}
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                      viewport={{ once: true }}
                      className="text-foreground/90 relative w-full h-full flex items-center flex-col justify-center gap-3 text-sm -translate-7  text-center leading-relaxed -rotate-[15deg]"
                    >
                      <StarRating value={5} />
                      <p className="relative w-[150px] mx-auto ">
                        {testimonial.title}
                      </p>
                      <p className="relative w-[150px] mx-auto ">
                        {testimonial.description}
                      </p>
                    </motion.span>
                    {/* Enhanced user info with animation */}
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                      viewport={{ once: true }}
                      className="absolute bottom-16 -rotate-[17deg] right-10  mt-auto flex items-center "
                    >
                      <div className="flex flex-col">
                        <h4 className="text-foreground font-medium whitespace-nowrap">
                          {`${testimonial.user.slice(
                            0,
                            5
                          )}...${testimonial.user.slice(-3)}`}
                        </h4>
                      </div>
                    </motion.div>
                    <motion.div
                      dir="rtl"
                      initial={{ opacity: 0, y: 5 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                      viewport={{ once: true }}
                      className="absolute bottom-16 -rotate-[17deg] left-12  mt-auto flex items-center "
                    >
                      <span className=" text-xs md:text-sm ">
                        {formatTimeToNow(new Date(testimonial.createdAt))}
                      </span>
                    </motion.div>
                  </motion.div>
                </ClipPathMessage>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
