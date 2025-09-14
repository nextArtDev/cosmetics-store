'use client'
import Pagination from '@/app/(home)/search/components/Pagination'
import ProductGrid from '@/app/(home)/search/components/ProductGrid'
import { Button } from '@/components/ui/button'
import { SearchProductsResult } from '@/lib/types/home'
import { FC } from 'react'

interface BookmarkedPageClientProps {
  products: SearchProductsResult
}

const BookmarkedPageClient: FC<BookmarkedPageClientProps> = ({ products }) => {
  return (
    <div className="relative min-h-screen pt-16 overflow-x-hidden">
      <div
        className="absolute inset-0 -z-10"
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
      <ProductGrid products={products.products} loading={false} />

      {/* Pagination */}
      {products.pagination.pages > 1 && (
        <div className="mt-12">
          <Pagination
            pagination={products.pagination}
            // onPageChange={handlePageChange}
            onPageChange={() => {}}
          />
        </div>
      )}

      {/* Load More Button for Mobile (Alternative to Pagination) */}
      {products.pagination.hasNext && (
        <div className="mt-8 text-center lg:hidden">
          <Button
            variant="outline"
            // onClick={() => handlePageChange(results.pagination.current + 1)}
            // disabled={loading}
            className="w-full"
          >
            {/* {loading ? 'در حال بارگذاری...' : 'مشاهده بیشتر'} */}

            {'بیشتر'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default BookmarkedPageClient
