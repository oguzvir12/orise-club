'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Minus, Plus, ShoppingBag, Trash2, X, Tag, Check, AlertCircle, Truck, FileText } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const formatTL = (n: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(n)

const SHIPPING_FEE = 60

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, removeItem, updateQuantity } = useCart()
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState('')

  const [couponInput, setCouponInput] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [couponCodeName, setCouponCodeName] = useState('')
  const [couponError, setCouponError] = useState('')

  // Fatura adresi ve kargo tercihleri
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [billingAddressInput, setBillingAddressInput] = useState('')
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
        if (data) {
          setUserProfile(data)
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
  const finalTotal = subtotal - discountAmount + SHIPPING_FEE

  const validateCustomerProfile = (profile: any) => {
    if (!profile) return 'Kullanıcı profili bulunamadı.'

    const fullName = (profile.full_name || '').trim()
    const phone = (profile.phone || '').trim()
    const tcNo = (profile.tc_no || '').trim()
    const address = (profile.address || '').trim()

    const nameParts = fullName.split(' ')
    if (nameParts.length < 2 || fullName.toLowerCase().includes('asd') || fullName.toLowerCase().includes('qwe')) {
      return 'Lütfen geçerli bir Ad ve Soyad giriniz (Örn: Ahmet Yılmaz).'
    }

    const cleanPhone = phone.replace(/\D/g, '')
    if (!cleanPhone.startsWith('05') || cleanPhone.length < 10) {
      return 'Lütfen geçerli bir cep telefonu numarası giriniz (05XXXXXXXXX).'
    }

    if (!/^\d{11}$/.test(tcNo)) {
      return 'Fatura ve yasal süreçler için 11 haneli geçerli bir TCKN girmelisiniz.'
    }

    if (address.length < 10 || address.toLowerCase().includes('asd')) {
      return 'Lütfen geçerli ve açık bir teslimat adresi belirtiniz.'
    }

    if (!sameAsShipping && (!billingAddressInput || billingAddressInput.length < 10)) {
      return 'Lütfen geçerli bir ayrı fatura adresi belirtiniz.'
    }

    return null
  }

  const handleCheckout = async () => {
    setValidationError('')
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      alert('Sipariş vermek için lütfen giriş yapın.')
      return
    }

    setLoading(true)

    try {
      const { data: profile, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (profError || !profile) {
        setValidationError('Profil bilgileriniz okunamadı. Lütfen profilinizi güncelleyin.')
        setLoading(false)
        return
      }

      const errorMsg = validateCustomerProfile(profile)
      if (errorMsg) {
        setValidationError(errorMsg)
        setLoading(false)
        return
      }

      // Siparişi Supabase orders tablosuna kaydetme simülasyonu/hazırlığı
      const finalBillingAddr = sameAsShipping ? profile.address : billingAddressInput

      const orderPayload = {
        user_id: session.user.id,
        customer_name: profile.full_name,
        email: session.user.email,
        phone: profile.phone,
        tc_no: profile.tc_no,
        address: profile.address,
        billing_address: finalBillingAddr,
        same_billing: sameAsShipping,
        items: items,
        subtotal: subtotal,
        discount: discountAmount,
        shipping_fee: SHIPPING_FEE,
        total_price: finalTotal,
        status: 'Ödeme Bekliyor'
      }

      const { error: ordError } = await supabase.from('orders').insert([orderPayload])
      if (ordError) throw ordError

      setTimeout(() => {
        setLoading(false)
        alert('Siparişiniz oluşturuldu! İyzico güvenli ödeme sayfasına yönlendiriliyorsunuz.')
      }, 800)

    } catch (err: any) {
      setValidationError('Bir hata oluştu: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div aria-hidden={!isOpen} className={cn('fixed inset-0 z-[60]', isOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
      <div onClick={closeCart} className={cn('absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300', isOpen ? 'opacity-100' : 'opacity-0')} />

      <aside role="dialog" aria-label="Sepet" aria-modal="true" className={cn('absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-zinc-950 text-white shadow-2xl transition-transform duration-300 ease-out', isOpen ? 'translate-x-0' : 'translate-x-full')}>
        
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-black/80">
          <h2 className="flex items-center gap-2.5 text-sm font-black uppercase tracking-widest text-white">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span>Sepetim ({items.reduce((a, b) => a + (b.quantity || 1), 0)})</span>
          </h2>
          <button type="button" onClick={closeCart} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-zinc-300 hover:bg-primary hover:text-black cursor-pointer transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

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

        {items.length > 0 && (
          <div className="space-y-4 border-t border-white/10 bg-zinc-950 px-6 py-6 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
            
            {/* Fatura Adresi Tercihi */}
            <div className="space-y-2 pb-2 border-b border-white/5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                <input 
                  type="checkbox" 
                  checked={sameAsShipping} 
                  onChange={(e) => setSameAsShipping(e.target.checked)} 
                  className="rounded border-white/20 bg-black text-primary focus:ring-0 cursor-pointer h-4 w-4"
                />
                <span className="font-medium">Fatura adresim teslimat adresimle aynı</span>
              </label>

              {!sameAsShipping && (
                <div className="pt-1">
                  <input
                    type="text"
                    placeholder="Ayrı Fatura Adresinizi Giriniz"
                    value={billingAddressInput}
                    onChange={(e) => setBillingAddressInput(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">İndirim Kuponu</span>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-3 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Kupon kodunuz"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black pl-9 pr-3 py-2 text-xs text-white uppercase focus:border-primary focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-bold text-white hover:bg-primary hover:text-black transition-colors cursor-pointer"
                >
                  Uygula
                </button>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 pt-1">
                  <Check className="h-3.5 w-3.5" />
                  <span>Kupon Uygulandı ({couponCodeName} - %{appliedDiscount} İndirim)</span>
                </div>
              )}
              {couponError && <p className="text-[10px] font-mono text-red-400">{couponError}</p>}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/5 font-mono">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Ara Toplam</span>
                <span>{formatTL(subtotal)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-400">
                  <span>İndirim (%{appliedDiscount})</span>
                  <span>-{formatTL(discountAmount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1"><Truck size={13} /> Kargo Ücreti</span>
                <span>{formatTL(SHIPPING_FEE)}</span>
              </div>
              <div className="flex items-center justify-between pt-1 font-sans">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">Toplam Tutar</span>
                <span className="text-xl font-black text-primary">{formatTL(finalTotal)}</span>
              </div>
            </div>

            {validationError && (
              <div className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-[11px] text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block uppercase">Eksik / Geçersiz Bilgi:</span>
                  <span>{validationError} <a href="/profile" className="underline font-bold text-white">Profilini Düzenle →</a></span>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button 
                type="button" 
                disabled={loading} 
                onClick={handleCheckout} 
                className="w-full rounded-full bg-primary py-4 text-xs font-black uppercase tracking-widest text-black shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Bilgiler Kontrol Ediliyor...' : 'İyzico ile Güvenli Ödeme Yap'}
              </button>
              
              <div className="flex items-center justify-center pt-1">
                <Image 
                  src="/images/iyzico_ile_ode_horizontal_white.svg" 
                  alt="iyzico ile Öde" 
                  width={110} 
                  height={22} 
                  className="object-contain h-4 w-auto opacity-80" 
                />
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
