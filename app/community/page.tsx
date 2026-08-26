'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Check,
  ShieldCheck,
  AlertCircle,
  X,
  ChevronRight,
  Filter,
  MapPin,
  Instagram,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { SiteHeader } from '../../components/site-header'
import AuthModal from '../../components/auth-modal'

interface EventItem {
  id: string
  title: string
  branch: string
  date: string
  location: string
  instructor_name: string
  description: string
  image_url: string
}

const BRANCHES = [
  'TÜMÜ',
  'KOŞU',
  'YOGA & MOBILITY',
  'TENİS',
  'VOLEYBOL',
  'YELKEN',
]

export default function CommunityPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>('TÜMÜ')
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false)
  const [isKvkkModalOpen, setIsKvkkModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const [userId, setUserId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [healthAccepted, setHealthAccepted] = useState(false)
  const [kvkkAccepted, setKvkkAccepted] = useState(false)
  const [waiverAccepted, setWaiverAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [myRegisteredEventIds, setMyRegisteredEventIds] = useState<string[]>([])

  useEffect(() => {
    fetchEvents()
    checkUserSession()
  }, [])

  const checkUserSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      setUserEmail(session.user.email || '')
      setUserId(session.user.id)
      fetchUserData(session.user.id)
      fetchMyRegistrations(session.user.email!)
    }
  }

  const fetchUserData = async (uid: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle()
    if (data) {
      setFullName(data.full_name || '')
      setPhone(data.phone || '')
    }
  }

  const fetchMyRegistrations = async (email: string) => {
    const { data } = await supabase.from('event_registrations').select('event_id').ilike('email', email.trim())
    if (data) setMyRegisteredEventIds(data.map((r: any) => r.event_id))
  }

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true })
    if (data) setEvents(data)
  }

  const openRegisterModal = async (evt: EventItem) => {
    if (!userEmail) {
      setIsAuthModalOpen(true)
      return
    }
    if (myRegisteredEventIds.includes(evt.id)) {
      alert('Bu etkinliğe zaten katılım talebinde bulundunuz!')
      return
    }
    setSelectedEvent(evt)
    setIsModalOpen(true)
    setSuccess(false)
    setErrorMsg('')
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent) return
    if (!healthAccepted || !waiverAccepted || !kvkkAccepted) {
      setErrorMsg('Lütfen tüm yasal onay kutucuklarını işaretleyiniz.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const { error } = await supabase.from('event_registrations').insert([
        {
          event_id: selectedEvent.id,
          full_name: fullName.trim() || 'Kulüp Üyesi',
          phone: phone.trim() || 'Belirtilmemiş',
          email: userEmail.trim(),
          status: 'requested',
        },
      ])

      if (error) throw error

      if (userId) {
        const { data: profileData } = await supabase.from('profiles').select('xp').eq('id', userId).maybeSingle()
        await supabase.from('profiles').update({ xp: (profileData?.xp || 0) + 50 }).eq('id', userId)
      }

      setSuccess(true)
      fetchMyRegistrations(userEmail)
      setTimeout(() => {
        setIsModalOpen(false)
        setSuccess(false)
      }, 4000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Kayıt sırasında bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = selectedBranch === 'TÜMÜ' ? events : events.filter((e) => e.branch?.toUpperCase() === selectedBranch)

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/10 pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop"
            alt="ORISE Community"
            fill
            priority
            className="object-cover opacity-20 grayscale contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="max-w-3xl space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all hover:border-primary hover:bg-black hover:text-white mb-4"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-primary" />
              <span>Ana Sayfaya Dön</span>
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-md">
              <span>HAFTALIK ANTRENMAN TAKVİMİ</span>
            </div>
            <h1 className="font-sans text-4xl font-black tracking-tighter text-white sm:text-6xl lg:text-7xl leading-[1.05]">
              Toplulukla Tanış,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
                Ritmine Katıl.
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* BRANŞ FİLTRELERİ */}
      <section className="border-b border-white/10 bg-zinc-950/85 sticky top-16 z-40 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <Filter className="h-4 w-4 text-primary shrink-0 mr-2" />
              {BRANCHES.map((branch) => (
                <button
                  key={branch}
                  onClick={() => setSelectedBranch(branch)}
                  className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                    selectedBranch === branch
                      ? 'bg-primary text-black shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                      : 'border border-white/10 bg-black/60 text-zinc-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>

            <a
              href="https://www.instagram.com/orisecommunity/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-200 hover:border-primary hover:text-primary transition-all"
            >
              <Instagram className="h-4 w-4 text-primary" />
              <span>Instagram @orisecommunity</span>
            </a>
          </div>
        </div>
      </section>

      {/* ALT ALTA TARİH SIRALI LİSTE */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
            <h2 className="font-sans text-2xl font-black text-white">Yaklaşan Buluşmalar & Antrenmanlar</h2>
            <span className="text-xs font-mono text-zinc-500 uppercase">[{filteredEvents.length} ETKİNLİK]</span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="py-20 text-center text-zinc-500 font-mono text-xs">Aktif etkinlik bulunmuyor. Takipte kal!</div>
          ) : (
            filteredEvents.map((evt) => {
              const alreadyJoined = myRegisteredEventIds.includes(evt.id)
              const eventDate = new Date(evt.date)

              return (
                <div
                  key={evt.id}
                  className="group relative flex flex-col md:flex-row items-center gap-6 rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8 backdrop-blur-md transition-all hover:border-primary/50"
                >
                  <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center w-full md:w-44 shrink-0 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
                      {eventDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      {eventDate.getDate()}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {eventDate.toLocaleDateString('tr-TR', { weekday: 'long' })} · {eventDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="relative aspect-[16/9] md:aspect-square w-full md:w-32 h-32 rounded-2xl overflow-hidden bg-zinc-950 shrink-0">
                    <Image
                      src={evt.image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop'}
                      alt={evt.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <div className="inline-block rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                      {evt.branch} {evt.instructor_name ? `• ${evt.instructor_name}` : ''}
                    </div>
                    <h3 className="text-xl font-black text-white">{evt.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{evt.description}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-[11px] font-mono text-zinc-500 pt-1">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{evt.location || 'İstanbul'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col w-full md:w-48 gap-2.5 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                    {alreadyJoined ? (
                      <div className="flex items-center justify-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400">
                        <Check className="h-4 w-4" />
                        <span>Talep Alındı</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openRegisterModal(evt)}
                        className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-xs font-bold uppercase tracking-widest text-black shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
                      >
                        <span>Ön Kayıt Ol</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}

                    <a
                      href="https://www.instagram.com/orisecommunity/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-black/60 py-2.5 text-[11px] font-bold uppercase tracking-wider text-zinc-300 hover:border-primary hover:text-primary transition-all"
                    >
                      <Instagram className="h-3.5 w-3.5 text-primary" />
                      <span>Detaylar Instagram'da</span>
                    </a>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* ÖN KAYIT MODALI */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}>
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-primary uppercase block">{selectedEvent.branch}</span>
                <h3 className="text-lg font-black text-white">{selectedEvent.title} - Ön Kayıt</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black cursor-pointer"><X className="h-4 w-4" /></button>
            </div>

            {success ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"><Check className="h-7 w-7" /></div>
                <h4 className="text-lg font-bold text-white">Ön Kayıt Talebiniz Alındı! (+50 XP)</h4>
                <p className="text-xs text-zinc-400">Yönetici onayından sonra durum profilinize yansıyacak. Tüm güncellemeler için <a href="https://www.instagram.com/orisecommunity/" target="_blank" rel="noopener noreferrer" className="text-primary underline">@orisecommunity</a> hesabını takip et!</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Ad Soyad</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Ad Soyad" className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Telefon</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="05XX XXX XX XX" className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">E-Posta</label>
                  <input type="email" value={userEmail} readOnly className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-white opacity-75 cursor-not-allowed" />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5">
                    <input type="checkbox" id="health" required checked={healthAccepted} onChange={(e) => setHealthAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-black text-primary cursor-pointer" />
                    <label htmlFor="health" className="text-[11px] leading-relaxed text-zinc-300">Spor antrenmanlarına katılmaya engel sağlık problemim olmadığını beyan ederim.</label>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5">
                    <input type="checkbox" id="waiver" required checked={waiverAccepted} onChange={(e) => setWaiverAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-black text-primary cursor-pointer" />
                    <label htmlFor="waiver" className="text-[11px] leading-relaxed text-zinc-300"><strong className="text-white">Feragatname:</strong> Etkinlik sırasındaki kaza ve risklerden şahsımın sorumlu olduğunu kabul ederim.</label>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5">
                    <input type="checkbox" id="kvkk" required checked={kvkkAccepted} onChange={(e) => setKvkkAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-black text-primary cursor-pointer" />
                    <label htmlFor="kvkk" className="text-[11px] leading-relaxed text-zinc-300">Medya kullanımına ve KVKK kapsamında işlenmesine onay veriyorum.</label>
                  </div>
                </div>

                {errorMsg && <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs text-red-400 rounded-xl">{errorMsg}</div>}

                <button type="submit" disabled={loading} className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black hover:scale-[1.02] transition-transform cursor-pointer">
                  {loading ? 'İşleniyor...' : 'Ön Kayıt Talebini Gönder'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={() => checkUserSession()} />
    </div>
  )
}
