import Link from 'next/link'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import { FC } from 'react'

interface BreadcrumbProps {
  links: { id: string; label: string; href: string }[]
}

const ProductBreadcrumb: FC<BreadcrumbProps> = ({ links }) => {
  console.log({ links })
  return (
    <Breadcrumb className="pt-28 pr-8">
      <BreadcrumbList>
        {links.map((link, i) => (
          <BreadcrumbItem key={link.id}>
            {i < links.length - 1 ? (
              <BreadcrumbLink asChild>
                <>
                  <Link href={link.href}>{link.label}</Link>
                  {i < links.length - 1 && <BreadcrumbSeparator />}
                </>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{link.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
      {/* <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/components">Components</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem> */}
    </Breadcrumb>
  )
}

export default ProductBreadcrumb
