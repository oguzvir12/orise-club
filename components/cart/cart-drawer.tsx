'use client'

import Image from 'next/image'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { cn } from '@/lib/utils'

const formatTL = (n: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(n)

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    subtotal,
    removeItem,
    updateQuantity,
  } = useCart()

  return (
    <div
      aria-hidden={!isOpen}
      className={cn(
        'fixed inset-0 z-[60]',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none',
      )}
    >
      <div
        onClick={closeCart}
        className={cn(
          'absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside
        role="dialog"
        aria-label="Sepet"
        aria-modal="true"
        className={cn(
          'absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-display flex items-center gap-2 text-lg font-bold tracking-wide">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Sepetin
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Sepeti kapat"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-display text-base font-semibold">
              Sepetin şimdilik boş
            </p>
            <p className="text-sm text-muted-foreground">
              Kulübe özel drop parçalarını keşfetmeye başla.
            </p>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-5">
                <div className="relative h-20 w-20 flex-none overflow-hidden rounded-lg border border-border bg-secondary">
                  <Image
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug">
                      {item.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`${item.name} ürününü kaldır`}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="Adet azalt"
                        className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Adet arttır"
                        className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {formatTL(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className="space-y-4 border-t border-border px-6 py-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Kargo</span>
              <span className="text-foreground">Ödeme adımında hesaplanır</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-semibold">
                Ara Toplam
              </span>
              <span className="font-display text-xl font-bold text-primary">
                {formatTL(subtotal)}
              </span>
            </div>
            <button
              type="button"
              className="w-full rounded-full bg-primary py-3.5 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-accent"
            >
              Ödemeye Geç
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Sınırlı üretim · Club Drop parçaları hızlıca tükenir.
            </p>
          </div>
        )}
      </aside>
    </div>
  )
}
