'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Minus, Plus, ShoppingBag, Trash2, X, Tag, Check, AlertCircle, Truck, MapPin } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const formatTL = (n: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(n)

const STANDARD_SHIPPING_FEE = 80
const FREE_SHIPPING_THRESHOLD = 2000

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, removeItem, updateQuantity, clearCart } = useCart() as any
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState('')

  const [deliveryType, setDeliveryType] = useState<'cargo' | 'pickup'>('cargo')

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
  const isFreeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD
  
  // Elden teslim seçilirse kargo ücreti 0 TL, aksi takdirde 80 TL (2000 TL üstü ücretsiz)
  const shippingFee = deliveryType === 'pickup' ? 0 : (isFreeShipping ? 0 : STANDARD_SHIPPING_FEE)
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

      if (!profile || !profile.full_name || !profile.phone || !profile.tc_no || (deliveryType === 'cargo' && !profile.address)) {
        setValidationError('Lütfen profilinizdeki Ad, Telefon, TCKN ve Teslimat Adresi alanlarını eksiksiz doldurun.')
        setLoading(false)
        return
      }

      for (const cartItem of items) {
        const lastHyphenIdx = cartItem.id.lastIndexOf('-')
        const size = cartItem.id.substring(lastHyphenIdx + 1)
        const rest = cartItem.id.substring(0, lastHyphenIdx)
        const secondLastHyphenIdx = rest.lastIndexOf('-')
        const productId = rest.substring(0, secondLastHyphenIdx)
        const color = rest.substring(secondLastHyphenIdx + 1)

        const { data: prodRecord } = await supabase.from('products').select('*').eq('id', productId).maybeSingle()
        if (prodRecord && prodRecord.sizes) {
          let updatedSizes = { ...prodRecord.sizes }

          if (updatedSizes[color] && typeof updatedSizes[color] === 'object') {
            const currentStock = updatedSizes[color][size] || 0
            const newStock = Math.max(0, currentStock - (cartItem.quantity || 1))
            updatedSizes[color] = {
              ...updatedSizes[color],
              [size]: newStock
            }
          } else {
            const currentStock = updatedSizes[size] || 0
            const newStock = Math.max(0, currentStock - (cartItem.quantity || 1))
            updatedSizes[size] = newStock
          }

          let newTotalStock = 0
          Object.values(updatedSizes).forEach((val: any) => {
            if (typeof val === 'object' && val !== null) {
              newTotalStock += Object.values(val).reduce((a: any, b: any) => a + Number(b || 0), 0)
            } else {
              newTotalStock += Number(val || 0)
            }
          })

          await supabase.from('products').update({
            sizes: updatedSizes,
            stock: newTotalStock
          }).eq('id', productId)
        }
      }

      const orderPayload = {
        user_id: session.user.id,
        customer_name: profile.full_name,
        email: session.user.email,
        phone: profile.phone,
        tc_no: profile.tc_no,
        address: deliveryType === 'pickup' ? 'ORISE Community Etkinlik Noktası (Elden Teslim)' : profile.address,
        billing_address: sameAsShipping ? (deliveryType === 'pickup' ? (profile.address || 'Belirtilmedi') : profile.address) : billingAddressInput,
        same_billing: sameAsShipping,
        delivery_type: deliveryType,
        items: items,
        subtotal: subtotal,
        discount: discountAmount,
        shipping_fee: shippingFee,
        total_price: finalTotal,
        status: 'Ödeme Bekliyor',
        tracking_number: null
      }

      const { error: ordError } = await supabase.from('orders').insert([orderPayload])
      if (ordError) throw ordError

      if (typeof clearCart === 'function') {
        clearCart()
      }

      setLoading(false)
      closeCart()
      window.location.href = '/profile'

    } catch (err: any) {
      setValidationError('Hata: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div aria-hidden={!isOpen} className={cn('fixed inset-0 z-[60]', isOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
      <div onClick={closeCart} className={cn('absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300', isOpen ? 'opacity-100' : 'opacity-0')} />

      <aside role="dialog" aria-modal="true" className={cn('absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-[#D8D6D2]/10 bg-[#111111] text-[#F5F2EC] shadow-2xl transition-transform duration-300 ease-out', isOpen ? 'translate-x-0' : 'translate-x-full')}>
        
        <div className="flex items-center justify-between border-b border-[#D8D6D2]/10 px-6 py-5 bg-[#111111]/90">
          <h2 className="flex items-center gap-2.5 text-sm font-['Vast_XXL',sans-serif] font-black uppercase tracking-widest text-[#FFFFFF]">
            <ShoppingBag className="h-4 w-4 text-[#F74A05]" />
            <span>Sepetim ({items.reduce((a: any, b: any) => a + (b.quantity || 1), 0)})</span>
          </h2>
          <button type="button" onClick={closeCart} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[#D8D6D2] hover:bg-[#F74A05] hover:text-[#111111] cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {items.length > 0 && deliveryType === 'cargo' && (
          <div className="bg-[#111111] border-b border-[#D8D6D2]/10 px-6 py-2.5 text-[11px] font-mono text-[#D8D6D2] flex items-center justify-between">
            {isFreeShipping ? (
              <span className="text-emerald-400 font-bold w-full text-center">🎉 2000 TL Üzeri Ücretsiz Kargo Kazandınız!</span>
            ) : (
              <span>Ücretsiz kargo için <strong className="text-[#F74A05]">{formatTL(remainingForFreeShipping)}</strong> daha ekleyin!</span>
            )}
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-[#D8D6D2]/40" />
            <p className="text-base font-bold text-[#FFFFFF]">Sepetiniz şimdilik boş</p>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-[#D8D6D2]/10 overflow-y-auto px-6 py-2">
            {items.map((item: any) => (
              <li key={item.id} className="flex gap-4 py-4 items-center">
                <div className="relative h-20 w-20 flex-none overflow-hidden rounded-2xl border border-[#D8D6D2]/15 bg-[#111111]">
                  <Image src={item.image || '/placeholder.svg'} alt={item.name} fill className="object-contain p-1" />
                </div>
                <div className="flex flex-1 flex-col justify-between space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-[#FFFFFF] line-clamp-2">{item.name}</p>
                    <button type="button" onClick={() => removeItem(item.id)} className="text-[#D8D6D2]/60 hover:text-red-400 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1">
                    <div className="inline-flex items-center rounded-xl border border-[#D8D6D2]/20 bg-black/80 px-1 py-0.5">
                      <button type="button" onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[#D8D6D2] hover:bg-white/10 hover:text-white cursor-pointer"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-xs font-bold text-[#FFFFFF] tabular-nums">{item.quantity || 1}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[#D8D6D2] hover:bg-white/10 hover:text-white cursor-pointer"><Plus className="h-3 w-3" /></button>
                    </div>
                    <span className="text-xs font-black text-[#F74A05]">{formatTL(item.price * (item.quantity || 1))}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className="space-y-4 border-t border-[#D8D6D2]/10 bg-[#111111] px-6 py-6 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
            
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-[#F74A05] font-bold">Teslimat Yöntemi Seçin</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryType('cargo')}
                  className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    deliveryType === 'cargo' ? 'border-[#F74A05] bg-[#F74A05]/10 text-white' : 'border-[#D8D6D2]/15 bg-black/40 text-[#D8D6D2]'
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-xs font-bold"><Truck size={14} className="text-[#F74A05]" /> Aras Kargo</span>
                  <span className="text-[10px] opacity-70 mt-1">80 TL (2000₺ Üstü Ücretsiz)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    deliveryType === 'pickup' ? 'border-[#F74A05] bg-[#F74A05]/10 text-white' : 'border-[#D8D6D2]/15 bg-black/40 text-[#D8D6D2]'
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-xs font-bold"><MapPin size={14} className="text-[#F74A05]" /> Elden Teslim</span>
                  <span className="text-[10px] opacity-70 mt-1">Ücretsiz (Etkinlikte Al)</span>
                </button>
              </div>

              {deliveryType === 'pickup' && (
                <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-[11px] text-amber-300 font-mono">
                  💡 Seçtiğiniz ürün, bir sonraki <strong>ORISE Community</strong> etkinlik buluşmasında tarafınıza elden teslim edilecektir. Detaylar için sizinle iletişime geçilecektir.
                </div>
              )}
            </div>

            <div className="space-y-2 border-b border-[#D8D6D2]/10 pb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#D8D6D2]/60" />
                  <input
                    type="text"
                    placeholder="Kupon Kodu"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full rounded-xl border border-[#D8D6D2]/20 bg-black pl-9 pr-3 py-2 text-xs text-[#FFFFFF] uppercase focus:border-[#F74A05] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="rounded-xl bg-[#D8D6D2]/15 px-4 py-2 text-xs font-bold text-[#FFFFFF] hover:bg-[#F74A05] hover:text-[#111111] transition-colors cursor-pointer"
                >
                  Uygula
                </button>
              </div>
              {couponError && <p className="text-[10px] text-red-400">{couponError}</p>}
              {appliedDiscount > 0 && (
                <div className="flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  <span>✓ Kupon Uygulandı: <strong>{couponCodeName}</strong> (%{appliedDiscount} İndirim)</span>
                  <button onClick={() => { setAppliedDiscount(0); setCouponCodeName('') }} className="text-xs hover:underline font-bold">Kaldır</button>
                </div>
              )}
            </div>

            <div className="space-y-2 border-b border-[#D8D6D2]/10 pb-4">
              <label className="flex items-center gap-2 text-xs font-mono text-[#D8D6D2] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={sameAsShipping} 
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="rounded border-zinc-700 bg-black text-[#F74A05] focus:ring-[#F74A05] h-4 w-4"
                />
                <span>Fatura adresim teslimat adresimle aynı</span>
              </label>

              {!sameAsShipping && (
                <div className="space-y-1 pt-1">
                  <label className="text-[10px] font-mono uppercase text-[#F74A05] font-bold">Fatura Adresi</label>
                  <input
                    type="text"
                    placeholder="Mahalle, Cadde, No, İlçe/İl..."
                    value={billingAddressInput}
                    onChange={(e) => setBillingAddressInput(e.target.value)}
                    className="w-full rounded-xl border border-[#D8D6D2]/20 bg-black px-3 py-2.5 text-xs text-[#FFFFFF] focus:border-[#F74A05] focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-xs text-[#D8D6D2]">
                <span>Ara Toplam</span>
                <span>{formatTL(subtotal)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-400">
                  <span>İndirim (%{appliedDiscount})</span>
                  <span>-{formatTL(discountAmount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-[#D8D6D2]">
                <span className="flex items-center gap-1">
                  {deliveryType === 'pickup' ? <MapPin size={13} /> : <Truck size={13} />} 
                  {deliveryType === 'pickup' ? 'Elden Teslim (Etkinlikte)' : 'Kargo Ücreti (Aras)'}
                </span>
                <span>
                  {deliveryType === 'pickup' ? (
                    <span className="text-emerald-400 font-bold uppercase">Ücretsiz</span>
                  ) : (
                    isFreeShipping ? <span className="text-emerald-400 font-bold uppercase">Ücretsiz</span> : formatTL(STANDARD_SHIPPING_FEE)
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 font-sans border-t border-[#D8D6D2]/10 mt-2">
                <span className="text-xs font-mono uppercase text-[#D8D6D2]">Toplam Tutar</span>
                <span className="text-xl font-black text-[#F74A05]">{formatTL(finalTotal)}</span>
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
                className="w-full rounded-full bg-[#F74A05] py-4 text-xs font-black uppercase tracking-widest text-[#111111] shadow-lg cursor-pointer disabled:opacity-50 hover:bg-orange-600 transition-colors"
              >
                {loading ? 'İşleniyor...' : 'Siparişi Tamamla (İyzico Hazır)'}
              </button>
              
              <div className="flex items-center justify-center gap-3 pt-2 opacity-80">
                <span className="text-[10px] font-mono text-[#D8D6D2]/60 uppercase">Güvenli Altyapı:</span>
                <span className="text-[10px] font-bold font-mono text-[#D8D6D2]">Mastercard / VISA / Troy</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
