import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

const SmallCard = () => {
  return (
    <Card className="bg-white/10 backdrop-blur-xs !pb-1">
      <CardContent className="w-full h-[200px] grid grid-rows-2 flex-col gap-0.5 items-center justify-center !p-0 px-0.5 ">
        <div className="w-full h-full shrink-0 flex flex-col px-1">
          <p className="font-semibold text-red-500">کرمهای زیبایی</p>
          <p className="px-1 text-xs text-amber-600">
            تضمین اصالت و کیفیت کرمهای زیبایی را از ما بخواهید!
          </p>
        </div>
        <figure className="relative w-[94%] mx-auto h-full shrink-0 overflow-hidden rounded-md  shadow-[0px_-6px_0px_0px_rgba(223,233,234,0.4),0px_-12px_0px_0px_rgba(149,155,164,0.3),0px_-15px_0px_0px_rgba(232,232,225,0.2),0px_-17px_8px_-3px_rgba(224,212,211,0.1),0px_-33px_18px_-7px_rgba(224,222,219,0.1)]">
          <Image
            fill
            className="object-cover "
            src="/images/p4.webp"
            alt="image"
          />
          <Link
            href={'/'}
            className="absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 bg-white/10 backdrop-blur-xs rounded-2xl text-red-700"
          >
            محصولات
          </Link>
        </figure>
      </CardContent>
    </Card>
  )
}

export default SmallCard
