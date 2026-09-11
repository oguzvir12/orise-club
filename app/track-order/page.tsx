'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, Package, ArrowLeft, CheckCircle, Truck, Clock } from 'lucide-react'
import Link from 'next/link'

export default function TrackOrderPage() {
  const [orderCode, setOrderCode] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<any | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setOrder(null)

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_code', orderCode.trim().toUpperCase())
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    setLoading(false)

    if (error || !data) {
      setErrorMsg('Sipariş bulunamadı. Lütfen sipariş kodunuzu ve e-posta adresinizi kontrol edip tekrar deneyin.')
    } else {
      setOrder(data)
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F2EC] pt-28 pb-16 px-4 sm:px-8 lg:px-16 font-sans">
      <div className="mx-auto max-w-2xl space-y-8">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link href="/store" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Mağazaya Dön
          </Link>
          <h1 className="font-['Vast_XXL',sans-serif] text-xl font-black uppercase text-white">Sipariş Takibi</h1>
        </div>

        <form onSubmit={handleTrack} className="space-y-4 bg-black/40 border border-white/15 p-6 sm:p-8 rounded-3xl backdrop-blur-xl">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#F74A05] font-bold">Misafir Sipariş Sorgulama</h2>
          
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-300">Sipariş Takip Kodu (Örn: ORISE-XXXXXX)</label>
            <input 
              type="text" 
              required 
              value={orderCode} 
              onChange={(e) => setOrderCode(e.target.value)} 
              placeholder="ORISE-123456" 
              className="w-full rounded-xl border border-white/15 bg-black p-3.5 text-xs text-white uppercase font-mono focus:border-[#F74A05] focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-300">Sipariş Verilen E-posta Adresi</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="ornek@mail.com" 
              className="w-full rounded-xl border border-white/15 bg-black p-3.5 text-xs text-white focus:border-[#F74A05] focus:outline-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
              {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#F74A05] text-[#111111] font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all cursor-pointer shadow-[0_0_25px_rgba(247,74,5,0.4)] disabled:opacity-50"
          >
            {loading ? 'Sorgulanıyor...' : 'Siparişimi Sorgula'}
          </button>
        </form>

        {order && (
          <div className="bg-black/40 border border-white/15 p-6 sm:p-8 rounded-3xl space-y-6 backdrop-blur-xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Sipariş Kodu</span>
                <div className="text-sm font-mono font-bold text-[#F74A05]">{order.order_code}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Durum</span>
                <div className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1 justify-end">
                  <Clock size={14} /> {order.status}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-300">
                <span>Alıcı:</span>
                <span className="text-white font-bold">{order.full_name}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Teslimat Adresi:</span>
                <span className="text-white text-right max-w-[250px]">{order.address}</span>
              </div>
              {order.tracking_number && (
                <div className="flex justify-between text-zinc-300 pt-2 border-t border-white/10">
                  <span>Kargo Takip No:</span>
                  <span className="text-[#F74A05] font-bold">{order.tracking_number}</span>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">Ürünler</span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs border border-white/10 p-3 rounded-xl bg-black/30">
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="font-mono text-zinc-400">₺{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/10 text-sm font-black text-white">
              <span>Toplam Tutar:</span>
              <span className="text-[#F74A05]">₺{order.total_amount?.toLocaleString('tr-TR')}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
