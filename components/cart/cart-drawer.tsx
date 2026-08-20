'use client'

import Image from 'next/image'
import { Minus, Plus, ShoppingBag, Trash2, X, Ticket } from 'lucide-react'
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
          'absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-zinc-950 text-white shadow-2xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-black/60">
          <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wider text-white">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span>Ortak Sepet & Biletler</span>
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Sepeti kapat"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-zinc-300 transition-colors hover:bg-primary hover:text-black cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-zinc-900">
              <ShoppingBag className="h-7 w-7 text-zinc-500" />
            </div>
            <p className="text-base font-bold text-white">
              Sepetiniz şimdilik boş
            </p>
            <p className="text-xs text-zinc-400">
              Kulübe özel drop parçalarını veya etkinlik biletlerini ekleyin.
            </p>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-white/5 overflow-y-auto px-6">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-5 items-center">
                <div className="relative h-20 w-20 flex-none overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
                  <Image
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  {item.type === 'ticket' && (
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                      <Ticket className="h-6 w-6 text-primary drop-shadow" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {item.type === 'ticket' && (
                        <span className="text-[9px] font-mono uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full inline-block mb-1">
                          Etkinlik Rezervasyonu
                        </span>
                      )}
                      <p className="text-xs font-bold leading-snug text-white">
                        {item.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label="Ürünü kaldır"
                      className="text-zinc-500 transition-colors hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {item.type === 'product' ? (
                      <div className="inline-flex items-center rounded-full border border-white/10 bg-black/40">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="inline-flex h-7 w-7 items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="inline-flex h-7 w-7 items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-400">1 Kişilik Bilet</span>
                    )}

                    <span className="text-xs font-bold text-primary">
                      {formatTL(item.price * (item.quantity || 1))}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className="space-y-4 border-t border-white/10 bg-black/80 px-6 py-6">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Teslimat & Kargo</span>
              <span className="text-white">Ödeme adımında hesaplanır</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">
                Toplam Tutar
              </span>
              <span className="text-xl font-black text-primary">
                {formatTL(subtotal)}
              </span>
            </div>
            <button
              type="button"
              className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:scale-[1.02] transition-transform cursor-pointer"
            >
              Ödemeyi Tamamla
            </button>
            <p className="text-center text-[10px] font-mono text-zinc-500">
              Güvenli Kulüp Altyapısı · ORISE 2026
            </p>
          </div>
        )}
      </aside>
    </div>
  )
}
