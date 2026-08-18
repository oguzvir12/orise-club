'use client'

import { useMemo, useState } from 'react'
import { CATEGORIES, PRODUCTS, type ProductCategory } from '@/lib/products'
import { ProductCard } from '@/components/store/product-card'
import { cn } from '@/lib/utils'

export function StoreGrid() {
  const [active, setActive] = useState<ProductCategory | 'all'>('all')

  const filtered = useMemo(
    () =>
      active === 'all'
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === active),
    [active],
  )

  return (
    <div className="space-y-10">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Ürün kategorileri"
      >
        {CATEGORIES.map((cat) => {
          const selected = active === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(cat.id)}
              className={cn(
                'rounded-full border px-5 py-2.5 text-sm font-medium transition-colors',
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
