'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, ShoppingBag, Trash2, X, Truck, Store } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const formatTL = (n: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(n)

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, removeItem, updateQuantity } = useCart()
  const [deliveryType, setDeliveryType] = useState<'shipping' | 'pickup'>('shipping')
  const [loading, setLoading] = useState(false)

  // Ödeme ve Sipariş Akışı
  const handleCheckout = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      alert('Sipariş vermek için lütfen giriş yapın.')
      return
    }

    setLoading(true)
    try {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()

      // Siparişi veritabanına kaydediyoruz
      const orderPayload = {
        user_id: session.user.id,
        customer_name: profile?.full_name || session.user.email,
        email: session.user.email,
        phone: profile?.phone || 'Belirtilmemiş',
        address: profile?.address || profile?.adres || 'Adres belirtilmemiş',
        items: items,
        total_price: subtotal,
        delivery_type: deliveryType,
        status: 'pending_payment' 
      }

      const { error } = await supabase.from('orders').insert([orderPayload]).select().single()
      if (error) throw error

      alert('İyzico güvenli ödeme sayfasına yönlendiriliyorsunuz...')
      
      // Ödeme simülasyonu veya yönlendirme
      // window.location.href = `/api/checkout?orderId=${insertedOrder.id}&amount=${subtotal}`

    } catch (err: any) {
      alert('Ödeme başlatılamadı: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div aria-hidden={!isOpen} className={cn('fixed inset-0 z-[60]', isOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
      <div onClick={closeCart} className={cn('absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300', isOpen ? 'opacity-100' : 'opacity-0')} />

      <aside role="dialog" aria-label="Sepet" aria-modal="true" className={cn('absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-zinc-950 text-white shadow-2xl transition-transform duration-300 ease-out', isOpen ? 'translate-x-0' : 'translate-x-full')}>
        
        {/* SEPET BAŞLIĞI */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-black/80">
          <h2 className="flex items-center gap-2.5 text-sm font-black uppercase tracking-widest text-white">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span>Ortak Sepet & Biletler</span>
          </h2>
          <button type="button" onClick={closeCart} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-zinc-300 hover:bg-primary hover:text-black cursor-pointer transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* SEPET BOŞSA */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-zinc-900">
              <ShoppingBag className="h-7 w-7 text-zinc-500" />
            </div>
            <p className="text-base font-bold text-white">Sepetiniz şimdilik boş</p>
            <p className="text-xs text-zinc-400">Kulübe özel drop parçalarını sepetinize ekleyin.</p>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-white/5 overflow-y-auto px-6 py-2">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-4 items-center">
                <div className="relative h-20 w-20 flex-none overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 flex items-center justify-center">
                  <Image src={item.image || '/placeholder.svg'} alt={item.name} fill sizes="80px" className="object-contain p-1" />
                </div>

                <div className="flex flex-1 flex-col justify-between space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold leading-snug text-white line-clamp-2">{item.name}</p>
                    <button type="button" onClick={() => removeItem(item.id)} className="text-zinc-500 hover:text-red-400 cursor-pointer transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-black/60">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="inline-flex h-7 w-7 items-center justify-center text-zinc-400 hover:text-white cursor-pointer"><Minus className="h-3 w-3" /></button>
                      <span className="w-6 text-center text-xs font-bold text-white tabular-nums">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="inline-flex h-7 w-7 items-center justify-center text-zinc-400 hover:text-white cursor-pointer"><Plus className="h-3 w-3" /></button>
                    </div>
                    <span className="text-xs font-black text-primary">{formatTL(item.price * (item.quantity || 1))}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* ALT ALAN: TESLİMAT VE ÖDEME */}
        {items.length > 0 && (
          <div className="space-y-4 border-t border-white/10 bg-zinc-950 px-6 py-6 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
            
            {/* Teslimat Yöntemi Seçimi */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">Teslimat Yöntemi Seçin</span>
              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setDeliveryType('shipping')} 
                  className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold transition-all cursor-pointer ${
                    deliveryType === 'shipping' 
                      ? 'border border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                      : 'border border-white/10 bg-black/60 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Truck className="h-4 w-4" /> 
                  <span>Kargo İstiyorum</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setDeliveryType('pickup')} 
                  className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold transition-all cursor-pointer ${
                    deliveryType === 'pickup' 
                      ? 'border border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                      : 'border border-white/10 bg-black/60 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Store className="h-4 w-4" /> 
                  <span>Elden Teslim</span>
                </button>
              </div>
            </div>

            {/* Toplam Tutar */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Toplam Tutar</span>
              <span className="text-xl font-black text-primary">{formatTL(subtotal)}</span>
            </div>

            {/* İyzico Ödeme Butonu */}
            <button 
              type="button" 
              disabled={loading} 
              onClick={handleCheckout} 
              className="w-full rounded-full bg-primary py-4 text-xs font-black uppercase tracking-widest text-black shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Ödeme Sayfasına Yönlendiriliyor...' : 'İyzico ile Güvenli Ödeme Yap'}
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
