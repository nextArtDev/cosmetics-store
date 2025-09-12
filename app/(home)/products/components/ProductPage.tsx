import ProductDetailCarousel from '@/components/product/product-detail-carousel'
import AddToCardBtn from '@/components/product/product-detail/AddToCardBtn'

import ProductStatements from '@/components/product/product-detail/ProductStatemeents'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ProductDetails, ProductReview, RelatedProduct } from '@/lib/types/home'
import { FC, useMemo } from 'react'
import ReviewList from './ReviewList'
import { Review } from '@/lib/generated/prisma'
import { SingleStarRating } from '@/components/home/testemonial/SingleStartRating'
// import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import FAQItem from '../../faq/components/FAQItem'
import { Badge } from '@/components/ui/badge'
import RelatedProductCarousel from '@/components/product/related-products-carousel'
import Countdown from './count-down'
import ProductProperties from './ProductProperties'

type ProductPageProp = {
  data: NonNullable<ProductDetails>
  userId?: string | null
  reviews: ProductReview[]
  productAverageRating: { rating: number; count: number } | null
  userReview: Review | null
  selectedSizeId: string
  selectedColorId: string
  relatedProducts: RelatedProduct[] | null
}
const ProductPage: FC<ProductPageProp> = ({
  data,
  userId,
  reviews,
  productAverageRating,
  userReview,
  relatedProducts,

  selectedColorId,
  selectedSizeId,
}) => {
  // console.log({ reviews, numReviews })
  const {
    description,
    sku,
    images,
    // variantImages,
    // sizes,
    // colors,
    variants,

    brand,
    // subCategory,
    id,
    name,
    slug,
    // weight,
    shippingFeeMethod,
    questions,
    specs,
    keywords,
    isSale,
    saleEndDate,
    // rating,
    // sales,
    // views,
    // isFeatured,
    // createdAt,
    // updatedAt,
    // category,
    // offerTag,
    // freeShipping,
  } = data
  //   console.log(specs, name)
  // const pathname = usePathname()
  // const { replace, refresh } = useRouter()
  // const searchParams = useSearchParams()
  // const params = new URLSearchParams(searchParams)

  // let updatedSizeId = sizeId

  // useEffect(() => {
  //   params.set('sizeId', sizeId)
  //   replace(`${pathname}?${params.toString()}`, {
  //     scroll: false,
  //   })
  //   return () => refresh()
  // }, [sizeId])
  // updatedSizeId = searchParams.get('sizeId')
  const currentVariant = variants.find(
    (v) => v.size?.id === selectedSizeId && v.color?.id === selectedColorId
  )

  const uniqueSizes = useMemo(() => {
    const seen = new Set()
    return variants
      .map((v) => v.size)
      .filter((size) => {
        if (!size || seen.has(size.id)) return false
        seen.add(size.id)
        return true
      })
  }, [variants])

  const uniqueColors = useMemo(() => {
    const seen = new Set()
    return variants
      .map((v) => v.color)
      .filter((color) => {
        if (!color || seen.has(color.id)) return false
        seen.add(color.id)
        return true
      })
  }, [variants])

  return (
    <section className="relative pb-24 w-full h-full">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
        radial-gradient(ellipse 80% 60% at 70% 20%, rgba(250, 145, 60, 0.85), transparent 68%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.75), transparent 68%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(228, 10, 75, 0.68), transparent 68%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba( 255, 215, 170, 0.3), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
        }}
      />
      <div className="max-w-2xl px-4 mx-auto  flex flex-col gap-4">
        <article className=" ">
          <ProductDetailCarousel
            images={[
              ...images,
              ...(variants?.flatMap(
                (vr) => vr?.images?.map((img) => ({ url: img.url })) ?? []
              ) ?? []),
            ]}
          />
        </article>

        {/* <ProductDetails /> */}
        <article className="grid grid-row-5 gap-4">
          <div className="flex gap-2">
            {productAverageRating && (
              <>
                <SingleStarRating rating={productAverageRating.rating} />
                {productAverageRating.rating}
                <p>{' از'}</p>
                {productAverageRating.count}
                <p>{' نظر'}</p>
              </>
            )}
          </div>
          <p className="text-sm font-semibold">{brand}</p>
          <p className="text-base font-bold">
            {/* medium handbag with double flap in grained leather */}
            {name}
          </p>

          <Separator />
          <article className="flex items-center justify-evenly">
            {/* === COLOR SELECTION === */}
            <div className="flex-1 flex flex-col gap-2 items-start">
              <p className="text-sm font-semibold">رنگ</p>
              <div className="flex gap-1">
                {uniqueColors.map((color) => {
                  if (!color) return null
                  // Check if any variant with this color is in stock
                  const isAvailable = variants.some(
                    (v) => v.color?.id === color.id && v.quantity > 0
                  )
                  return (
                    <Link
                      key={color.id}
                      // ✅ 3. THE CRITICAL CHANGE: Preserve the selectedSizeId
                      href={{
                        pathname: `/products/${slug}`,
                        query: { size: selectedSizeId, color: color.id },
                      }}
                      replace
                      scroll={false}
                      className={cn(
                        'rounded-full p-1 transition-all',
                        selectedColorId === color.id
                          ? 'ring-2 ring-offset-2 ring-blue-500'
                          : 'ring-1 ring-gray-300',
                        !isAvailable &&
                          'opacity-50 cursor-not-allowed pointer-events-none'
                      )}
                    >
                      <div
                        className="size-8 rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                    </Link>
                  )
                })}
              </div>
            </div>
            <Separator orientation="vertical" />
            {/* === SIZE SELECTION === */}
            <div className="flex-1 flex flex-col gap-2 items-start">
              <p className="text-sm font-semibold">سایز</p>
              <ul className="flex flex-wrap gap-1">
                {uniqueSizes.map((size) => {
                  if (!size) return null
                  const isAvailable = variants.some(
                    (v) => v.size?.id === size.id && v.quantity > 0
                  )
                  return (
                    <li key={size.id}>
                      <Link
                        // ✅ 4. THE CRITICAL CHANGE: Preserve the selectedColorId
                        href={{
                          pathname: `/products/${slug}`,
                          query: { size: size.id, color: selectedColorId },
                        }}
                        replace
                        scroll={false}
                        className={cn(
                          buttonVariants({
                            variant:
                              selectedSizeId === size.id
                                ? 'default'
                                : 'outline',
                          }),
                          !isAvailable &&
                            'opacity-50 cursor-not-allowed pointer-events-none'
                        )}
                      >
                        {size.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </article>
        </article>
        <Separator />
        <article>
          {isSale && saleEndDate && (
            <div className="mt-4 pb-2">
              <Countdown targetDate={saleEndDate} />
            </div>
          )}
        </article>
        <span className="text-green-600 flex gap-1 text-sm items-center">
          <span
            className={cn(
              'w-2 h-2 animate-pulse rounded-full',
              currentVariant && currentVariant.quantity > 0
                ? 'bg-green-600'
                : 'bg-red-600'
            )}
          ></span>
          {currentVariant && currentVariant.quantity > 0
            ? 'موجود'
            : 'اتمام موجودی'}
          {/* Show remaining quantity */}
          {currentVariant && currentVariant.quantity > 0 && (
            <span className="text-xs text-gray-500">
              ({currentVariant.quantity} عدد باقی مانده)
            </span>
          )}
        </span>
        <article className="sticky top-2">
          {currentVariant && currentVariant.size && currentVariant.color ? (
            <AddToCardBtn
              variant={{
                id: currentVariant?.id,
                size: currentVariant.size.name,
                color: currentVariant.color.name,
                price: currentVariant.price,
                discount: currentVariant.discount,
                quantity: currentVariant.quantity,
                weight: currentVariant?.weight,
              }}
              product={{
                id: id,
                slug: slug,
                name: name,
                image: (data.images[0] || data.variants[0]?.images)?.url,
                shippingFeeMethod: shippingFeeMethod,
              }}
            />
          ) : (
            <div className="bg-orange-100 border border-orange-200 rounded-md p-4 text-center">
              <p className="text-orange-700 font-medium">
                این ترکیب رنگ و سایز موجود نیست!
              </p>
              <p className="text-sm text-orange-600 mt-1">
                لطفا ترکیب دیگری از سایز و رنگ را انتخاب کنید.
              </p>
            </div>
          )}
        </article>

        {/* {currentVariant && currentVariant.quantity <= 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
            <p className="text-red-600 font-medium">
              این ترکیب رنگ و سایز موجود نیست.
            </p>
            <p className="text-sm text-red-500 mt-1">
              لطفاً ترکیب رنگ و سایز دیگری انتخاب کنید.
            </p>
          </div>
        )} */}
        <Link
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'max-w-sm mx-auto '
          )}
          href={'/cart'}
        >
          سبد خرید
        </Link>
        <Separator />
        <article className="flex flex-col gap-6 items-start py-12">
          <div className="flex flex-col gap-4 justify-around">
            {/* <p className="text-sm">{name}</p> */}
            {description && (
              <div className="flex  gap-3">
                <p className="font-semibold ">توضیحات:</p>
                <p
                  dangerouslySetInnerHTML={{ __html: description }}
                  className="font-semibold  text-justify"
                />
              </div>
            )}
            {sku && (
              <p dir="ltr" className="text-xs">
                SKU:{sku}
              </p>
            )}

            {!!keywords && (
              <div className="flex gap-3">
                <h1 className="font-semibold ">کلمات کلیدی:</h1>
                {keywords.split(',').map((k, i) => (
                  <Badge key={i} variant={'outline'}>
                    #{k}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Separator />
          <div className="w-full h-full flex  flex-col gap-4  ">
            <h1 className="font-semibold">ویژگی‌ها و ابعاد:</h1>

            {currentVariant && currentVariant.size && (
              <ProductProperties
                variant={currentVariant}
                weight={
                  currentVariant?.weight ? currentVariant.weight : undefined
                }
                specs={
                  !!specs.filter((s) => s.name.trim().length > 0).length
                    ? specs
                    : undefined
                }
              />
            )}
          </div>
        </article>
        <Separator />
        <ProductStatements />
        <Separator />
        {!!questions.filter((q) => q.question.trim().length > 0).length && (
          <div className="flex items-start w-full mx-auto max-w-2xl space-y-2">
            {questions.map((faq, index) => (
              <FAQItem
                key={index}
                {...faq}
                index={index}
                className="rounded-sm w-full"
              />
            ))}
          </div>
        )}
        <Separator />
        <ReviewList
          reviews={reviews}
          productId={id}
          userId={userId}
          productSlug={slug}
          // numReviews={numReviews}
          userReview={userReview}
        />

        <Separator />
      </div>
      <Separator />
      {!!relatedProducts?.length && (
        <section className="  flex gap-6 flex-col justify-center items-center py-8">
          <h2 className="font-bold text-2xl ">محصولات مرتبط</h2>
          <RelatedProductCarousel items={relatedProducts} />
        </section>
      )}
    </section>
  )
}

export default ProductPage
