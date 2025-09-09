import React from 'react'
import { InfiniteSlider } from './InfiniteSlider'
//https://motion-primitives.com/docs/infinite-slider

import Aesop from '../../../../public/logos/Aesop-logo-500x300.png'
import Alessandro from '../../../../public/logos/Alessandro-Logo-500x281.png'
import Align from '../../../../public/logos/Align-Logo-500x281.png'
import Always from '../../../../public/logos/Always-Logo-500x281.png'
import Amuse from '../../../../public/logos/Amuse-Cosmetics-Logo-500x286.png'
import Amway from '../../../../public/logos/Amway-Logo-500x281.png'

import Aquafresh from '../../../../public/logos/Aquafresh-Logo-500x281.webp'
import Ariel from '../../../../public/logos/Ariel-Logo-500x281.webp'
import Camay from '../../../../public/logos/Camay-Logo-500x281.webp'
import Carefree from '../../../../public/logos/Carefree-logo-500x281.webp'
import Discreet from '../../../../public/logos/Discreet-Logo-500x313.webp'
import DrGio from '../../../../public/logos/Dr-Gio-Cosmetics-Logo-500x281.webp'
import Estee from '../../../../public/logos/Estee-Lauder-logo-500x183.webp'
import Missha from '../../../../public/logos/Missha-Logo-500x281.webp'
import Naturella from '../../../../public/logos/Naturella-logo-500x281.webp'
import MrClean from '../../../../public/logos/Mr.-Clean-Logo-500x281.webp'
import OldSpice from '../../../../public/logos/Old-Spice-logo-500x281.webp'
import ScottLogo from '../../../../public/logos/Scott-Logo-500x314.webp'

import Image from 'next/image'
import { cn } from '@/lib/utils'

const logos = [
  { id: '1', imageSrc: Aesop, name: 'Aesop' },
  { id: '2', imageSrc: Alessandro, name: 'Alessandro' },
  { id: '3', imageSrc: Align, name: 'Align' },
  { id: '4', imageSrc: Always, name: 'Always' },
  { id: '5', imageSrc: Amuse, name: 'Amuse' },
  { id: '6', imageSrc: Aquafresh, name: 'Aquafresh' },
  { id: '7', imageSrc: Ariel, name: 'Ariel' },
  { id: '8', imageSrc: Camay, name: 'Camay' },
  { id: '9', imageSrc: Carefree, name: 'Carefree' },
  { id: '10', imageSrc: Discreet, name: 'Discreet' },
  { id: '11', imageSrc: DrGio, name: 'DrGio' },
  { id: '12', imageSrc: Estee, name: 'Estee' },
  { id: '13', imageSrc: Missha, name: 'Missha' },
  { id: '14', imageSrc: Naturella, name: 'Naturella' },
  { id: '15', imageSrc: MrClean, name: 'MrClean' },
  { id: '16', imageSrc: OldSpice, name: 'OldSpice' },
  { id: '17', imageSrc: ScottLogo, name: 'ScottLogo' },
  { id: '18', imageSrc: Amway, name: 'Amway' },
]
const Stats = () => {
  return (
    <div
      dir="ltr"
      className="w-full h-full flex flex-col gap-4 items-center justify-center"
    >
      <h1 className="sr-only">برند محصولات</h1>
      <InfiniteSlider gap={12} reverse>
        {logos.slice(0, 5).map((logo) => (
          <figure key={logo.id} className={cn('relative w-fit h-[150px')}>
            <Image
              width={logo.imageSrc.width / 3}
              height={120}
              src={logo.imageSrc.src}
              alt={`${logo.name} brand`}
              className=""
            />
          </figure>
        ))}
      </InfiniteSlider>
      <InfiniteSlider gap={12}>
        {logos.slice(5, 11).map((logo) => (
          <figure key={logo.id} className={cn('relative w-fit h-[150px')}>
            <Image
              width={logo.imageSrc.width / 3}
              height={120}
              src={logo.imageSrc.src}
              alt={`${logo.name} brand`}
              className=""
            />
          </figure>
        ))}
      </InfiniteSlider>
      <InfiniteSlider gap={12} reverse>
        {logos.slice(11).map((logo) => (
          <figure key={logo.id} className={cn('relative w-fit h-[150px')}>
            <Image
              width={logo.imageSrc.width / 3}
              height={120}
              src={logo.imageSrc.src}
              alt={`${logo.name} brand`}
              className=""
            />
          </figure>
        ))}
      </InfiniteSlider>
    </div>
  )
}

export default Stats
