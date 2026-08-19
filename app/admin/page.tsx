'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setRegistrations(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu katılımcı kaydını silmek/iptal etmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase.from('event_registrations').delete().eq('id', id)
      if (!error) {
        setRegistrations((prev) => prev.filter((r) => r.id !== id))
      }
    } catch (e) {
      alert('Silme sırasında hata oluştu.')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-10 font-sans">
      {/* Üst Bar */}
      <div className="mx-auto max-w-6xl flex items-center justify-between border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">ORISE Yönetici Paneli</h1>
            <p className="text-xs font-mono text-zinc-500">Canlı Etkinlik Kayıtları & Katılımcı Listesi</p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchData}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-xs font-bold text-primary hover:border-primary"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Yenile</span>
        </button>
      </div>

      {/* Katılımcı Tablosu */}
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <Users className="h-4 w-4 text-primary" />
              <span>Toplam Kayıt: {registrations.length} Kişi</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-white/10 bg-black/60 text-zinc-500 uppercase">
                <tr>
                  <th className="p-4">Katılımcı</th>
                  <th className="p-4">İletişim</th>
                  <th className="p-4">Etkinlik ID</th>
                  <th className="p-4">Durum</th>
                  <th className="p-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {registrations.length > 0 ? (
                  registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <span>{reg.full_name}</span>
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" title="Sağlık Beyanı Onaylı" />
                      </td>
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <Phone className="h-3 w-3 text-primary" />
                          <span>{reg.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-500">
                          <Mail className="h-3 w-3" />
                          <span>{reg.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-400">{reg.event_id}</td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            reg.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {reg.status === 'confirmed' ? 'Asil Kayıt' : 'Yedek Liste'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(reg.id)}
                          className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Kaydı İptal Et / Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      Henüz kayıtlı katılımcı bulunmuyor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
