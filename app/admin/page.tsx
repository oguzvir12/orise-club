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
  Lock,
  LogOut,
  CheckCircle,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Kulüp Yetkili Hesapları ve Branş Yetkileri
const ADMIN_USERS: Record<string, { pass: string; branch: string; title: string }> = {
  orise: { pass: 'orise2026', branch: 'ALL', title: 'Genel Kulüp Yöneticisi' },
  kosu: { pass: 'kosu2026', branch: 'KOŞU', title: 'Koşu Kaptanı' },
  yoga: { pass: 'yoga2026', branch: 'YOGA & MOBILITY', title: 'Yoga & Mobility Lideri' },
  tenis: { pass: 'tenis2026', branch: 'TENİS', title: 'Tenis Sorumlusu' },
  yelken: { pass: 'yelken2026', branch: 'YELKEN', title: 'Yelken Kaptanı' },
}

// Etkinlik ID'lerini branşlarla eşleştirme
const EVENT_BRANCH_MAP: Record<string, string> = {
  'evt-cadde-run-01': 'KOŞU',
  'evt-moda-yoga-01': 'YOGA & MOBILITY',
  'evt-kalamis-tennis-01': 'TENİS',
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  
  const [currentUser, setCurrentUser] = useState<{ branch: string; title: string } | null>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedAuth = localStorage.getItem('orise_admin_user')
    if (savedAuth && ADMIN_USERS[savedAuth]) {
      setIsLoggedIn(true)
      setCurrentUser(ADMIN_USERS[savedAuth])
      fetchData()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const user = ADMIN_USERS[username.trim().toLowerCase()]
    if (user && user.pass === password) {
      setIsLoggedIn(true)
      setCurrentUser(user)
      localStorage.setItem('orise_admin_user', username.trim().toLowerCase())
      setLoginError('')
      fetchData()
    } else {
      setLoginError('Hatalı kullanıcı adı veya şifre!')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    localStorage.removeItem('orise_admin_user')
  }

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
    if (!confirm('Bu katılımcı kaydını silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase.from('event_registrations').delete().eq('id', id)
      if (!error) {
        setRegistrations((prev) => prev.filter((r) => r.id !== id))
      }
    } catch (e) {
      alert('Silme sırasında hata oluştu.')
    }
  }

  // Eğer giriş yapılmadıysa Şifre Giriş Ekranı göster
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/40">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-black text-white">ORISE Yönetici Girişi</h1>
            <p className="text-xs text-zinc-400">Yetkili kullanıcı adı ve şifrenizle giriş yapın.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Kullanıcı Adı</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Örn: orise, kosu, yoga..."
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Şifre</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
              />
            </div>

            {loginError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:scale-[1.02] transition-transform"
            >
              Giriş Yap
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 underline">
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Giriş yapıldıysa Filtrelenmiş Liste Gösterilir
  const filteredRegistrations = registrations.filter((reg) => {
    if (currentUser?.branch === 'ALL') return true
    const eventBranch = EVENT_BRANCH_MAP[reg.event_id] || ''
    return eventBranch === currentUser?.branch
  })

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-10 font-sans">
      {/* Üst Bar */}
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">ORISE Yönetici Paneli</h1>
            <p className="text-xs font-mono text-primary uppercase">
              {currentUser?.title} {currentUser?.branch !== 'ALL' ? `(${currentUser?.branch})` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchData}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 hover:border-primary hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Katılımcı Tablosu */}
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <Users className="h-4 w-4 text-primary" />
              <span>Görüntülenen Kayıt: {filteredRegistrations.length} Kişi</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-white/10 bg-black/60 text-zinc-500 uppercase">
                <tr>
                  <th className="p-4">Katılımcı</th>
                  <th className="p-4">İletişim</th>
                  <th className="p-4">Etkinlik / Branş</th>
                  <th className="p-4">Durum</th>
                  <th className="p-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((reg) => (
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
                      <td className="p-4 text-zinc-400">
                        <span className="text-primary font-bold">{EVENT_BRANCH_MAP[reg.event_id] || reg.event_id}</span>
                      </td>
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
                      Bu branşta henüz kayıtlı katılımcı bulunmuyor.
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
