'use client'

import Image from 'next/image'
import { Plus } from 'lucide-react'
import type { Product } from '@/lib/products'
import { useCart } from '@/components/cart/cart-provider'

const formatTL = (n: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(n)

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.limited && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
            Limited Club Drop
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex-1 space-y-1">
          <h3 className="font-display text-base font-semibold leading-snug text-balance">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.fabric}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-lg font-bold text-primary">
            {formatTL(product.price)}
          </span>
          <button
            type="button"
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              })
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Sepete Ekle
          </button>
        </div>
      </div>
    </article>
  )
}
