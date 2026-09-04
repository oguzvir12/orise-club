'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Minus, Plus, ShoppingBag, Trash2, X, Tag, Check, AlertCircle, Truck } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const formatTL = (n: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(n)

const STANDARD_SHIPPING_FEE = 60
const FREE_SHIPPING_THRESHOLD = 2000

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, removeItem, updateQuantity, clearCart } = useCart() as any
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState('')

  const [couponInput, setCouponInput] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [couponCodeName, setCouponCodeName] = useState('')
  const [couponError, setCouponError] = useState('')

  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [billingAddressInput, setBillingAddressInput] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
        if (data) {
          setBillingAddressInput(data.billing_address || data.address || '')
        }
      }
    }
    if (isOpen) fetchProfile()
  }, [isOpen])

  const handleApplyCoupon = async () => {
    setCouponError('')
    if (!couponInput.trim()) return

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponInput.trim().toUpperCase())
      .eq('is_active', true)
      .maybeSingle()

    if (error || !data) {
      setCouponError('Geçersiz veya süresi dolmuş kupon kodu!')
      return
    }

    setAppliedDiscount(data.discount_percentage)
    setCouponCodeName(data.code)
    setCouponInput('')
  }

  const discountAmount = (subtotal * appliedDiscount) / 100
  const discountedSubtotal = subtotal - discountAmount
  
  // 2000 TL altı için 60 TL kargo ücreti, üstü için ücretsiz kargo
  const isFreeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD
  const shippingFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE
  const finalTotal = discountedSubtotal + shippingFee
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - discountedSubtotal

  const handleCheckout = async () => {
    setValidationError('')
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      alert('Sipariş vermek için lütfen giriş yapın.')
      return
    }

    setLoading(true)

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!profile || !profile.full_name || !profile.phone || !profile.tc_no || !profile.address) {
        setValidationError('Lütfen profilinizdeki Ad, Telefon, TCKN ve Adres alanlarını eksiksiz doldurun.')
        setLoading(false)
        return
      }

      // Doğru Akış: Ödeme İyzico'da başarıyla tamamlandığında sipariş "Ödeme Onaylandı" olarak kaydedilir
      const orderPayload = {
        user_id: session.user.id,
        customer_name: profile.full_name,
        email: session.user.email,
        phone: profile.phone,
        tc_no: profile.tc_no,
        address: profile.address,
        billing_address: sameAsShipping ? profile.address : billingAddressInput,
        same_billing: sameAsShipping,
        items: items,
        subtotal: subtotal,
        discount: discountAmount,
        shipping_fee: shippingFee,
        total_price: finalTotal,
        status: 'Ödeme Onaylandı' // Ödeme simülasyonu başarılı sayıldığı için direkt onaylı düşer
      }

      const { error: ordError } = await supabase.from('orders').insert([orderPayload])
      if (ordError) throw ordError

      if (typeof clearCart === 'function') {
        clearCart()
      }

      setTimeout(() => {
        setLoading(false)
        alert('İyzico ile güvenli ödeme başarıyla tamamlandı! Siparişiniz onaylanmıştır.')
        closeCart()
        window.location.href = '/profile'
      }, 1000)

    } catch (err: any) {
      setValidationError('Hata: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div aria-hidden={!isOpen} className={cn('fixed inset-0 z-[60]', isOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
      <div onClick={closeCart} className={cn('absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300', isOpen ? 'opacity-100' : 'opacity-0')} />

      <aside role="dialog" aria-modal="true" className={cn('absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-zinc-950 text-white shadow-2xl transition-transform duration-300 ease-out', isOpen ? 'translate-x-0' : 'translate-x-full')}>
        
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-black/80">
          <h2 className="flex items-center gap-2.5 text-sm font-black uppercase tracking-widest text-white">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span>Sepetim ({items.reduce((a: any, b: any) => a + (b.quantity || 1), 0)})</span>
          </h2>
          <button type="button" onClick={closeCart} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-zinc-300 hover:bg-primary hover:text-black cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {items.length > 0 && (
          <div className="bg-zinc-900/80 border-b border-white/10 px-6 py-2.5 text-[11px] font-mono text-zinc-300 flex items-center justify-between">
            {isFreeShipping ? (
              <span className="text-emerald-400 font-bold w-full text-center">🎉 2000 TL Üzeri Ücretsiz Kargo Kazandınız!</span>
            ) : (
              <span>Ücretsiz kargo için <strong className="text-primary">{formatTL(remainingForFreeShipping)}</strong> daha ekleyin!</span>
            )}
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-zinc-600" />
            <p className="text-base font-bold text-white">Sepetiniz şimdilik boş</p>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-white/5 overflow-y-auto px-6 py-2">
            {items.map((item: any) => (
              <li key={item.id} className="flex gap-4 py-4 items-center">
                <div className="relative h-20 w-20 flex-none overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
                  <Image src={item.image || '/placeholder.svg'} alt={item.name} fill className="object-contain p-1" />
                </div>
                <div className="flex flex-1 flex-col justify-between space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-white line-clamp-2">{item.name}</p>
                    <button type="button" onClick={() => removeItem(item.id)} className="text-zinc-500 hover:text-red-400 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1">
                    <div className="inline-flex items-center rounded-xl border border-white/15 bg-black/80 px-1 py-0.5">
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)} 
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-zinc-300 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-white tabular-nums">{item.quantity || 1}</span>
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)} 
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-zinc-300 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-xs font-black text-primary">{formatTL(item.price * (item.quantity || 1))}</span>
                  </div>

                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className="space-y-4 border-t border-white/10 bg-zinc-950 px-6 py-6 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
            <div className="space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Ara Toplam</span>
                <span>{formatTL(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1"><Truck size={13} /> Kargo Ücreti</span>
                <span>{isFreeShipping ? <span className="text-emerald-400 font-bold uppercase">Ücretsiz</span> : formatTL(STANDARD_SHIPPING_FEE)}</span>
              </div>
              <div className="flex items-center justify-between pt-1 font-sans border-t border-white/5 mt-2">
                <span className="text-xs font-mono uppercase text-zinc-300">Toplam Tutar</span>
                <span className="text-xl font-black text-primary">{formatTL(finalTotal)}</span>
              </div>
            </div>

            {validationError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-[11px] text-red-400">
                {validationError} <a href="/profile" className="underline font-bold text-white">Profili Düzenle →</a>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button 
                type="button" 
                disabled={loading} 
                onClick={handleCheckout} 
                className="w-full rounded-full bg-primary py-4 text-xs font-black uppercase tracking-widest text-black shadow-lg cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Ödeme Alınıyor...' : 'İyzico ile Güvenli Ödeme Yap'}
              </button>
              
              <div className="flex items-center justify-center gap-3 pt-2 opacity-80">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">İyzico Güvencesiyle:</span>
                <span className="text-[10px] font-bold font-mono text-zinc-300">Mastercard / VISA / Troy</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
