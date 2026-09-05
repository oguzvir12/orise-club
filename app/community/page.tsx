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
  Sparkles,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { SiteHeader } from '@/components/site-header'
import AuthModal from '@/components/auth-modal'

interface EventItem {
  id: string
  title: string
  branch: string
  date: string
  location: string
  capacity: number
  description: string
  image_url: string
  instructor_name?: string
}

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

    const handleFocus = () => fetchEvents()
    window.addEventListener('focus', handleFocus)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (currentSession?.user) {
        setUserEmail(currentSession.user.email || '')
        setUserId(currentSession.user.id)
        fetchUserData(currentSession.user.id)
        if (currentSession.user.email) fetchMyRegistrations(currentSession.user.email)
      } else {
        setUserEmail('')
        setUserId('')
        setFullName('')
        setPhone('')
        setMyRegisteredEventIds([])
      }
    })

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const checkUserSession = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (currentSession?.user) {
        setUserEmail(currentSession.user.email || '')
        setUserId(currentSession.user.id)
        await fetchUserData(currentSession.user.id)
        if (currentSession.user.email) await fetchMyRegistrations(currentSession.user.email)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchUserData = async (uid: string) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle()
      if (data) {
        setFullName(data.full_name || '')
        setPhone(data.phone || '')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchMyRegistrations = async (email: string) => {
    try {
      const { data } = await supabase
        .from('event_registrations')
        .select('event_id')
        .ilike('email', email.trim())

      if (data) {
        setMyRegisteredEventIds(data.map((r: any) => r.event_id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchEvents = async () => {
    try {
      const { data } = await supabase.from('events').select('*').order('date', { ascending: true })
      if (data) setEvents(data)
    } catch (e) {
      console.error(e)
    }
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

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      setUserId(session.user.id)
      await fetchUserData(session.user.id)
    }

    setSelectedEvent(evt)
    setIsModalOpen(true)
    setSuccess(false)
    setErrorMsg('')
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent) return

    if (!healthAccepted) {
      setErrorMsg('Lütfen sağlık ve sorumluluk beyanını onaylayınız.')
      return
    }

    if (!waiverAccepted) {
      setErrorMsg('Lütfen sorumluluk reddi ve feragatnameyi onaylayınız.')
      return
    }

    if (!kvkkAccepted) {
      setErrorMsg('Lütfen KVKK ve medya kullanım iznini onaylayınız.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const { data: existing } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', selectedEvent.id)
        .ilike('email', userEmail.trim())
        .maybeSingle()

      if (existing) {
        setErrorMsg('Bu etkinliğe zaten başvurdunuz!')
        setLoading(false)
        return
      }

      const { error } = await supabase.from('event_registrations').insert([
        {
          event_id: selectedEvent.id,
          full_name: fullName.trim() || 'Kulüp Üyesi',
          phone: phone.trim() || 'Belirtilmemiş',
          email: userEmail.trim(),
          status: 'requested',
          is_paid: true,
        },
      ])

      if (error) throw error

      setSuccess(true)
      setHealthAccepted(false)
      setKvkkAccepted(false)
      setWaiverAccepted(false)
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

  const now = new Date()
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now)

  const activeBranches = Array.from(new Set(upcomingEvents.map((e) => (e.branch || 'GENEL').toUpperCase())))
  const availableBranches = ['TÜMÜ', ...activeBranches]

  const filteredEvents =
    selectedBranch === 'TÜMÜ'
      ? upcomingEvents
      : upcomingEvents.filter((e) => e.branch?.toUpperCase() === selectedBranch)

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/10 pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/community-hero.jpeg"
            alt="Orise Club"
            fill
            priority
            className="object-cover opacity-30 grayscale contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="max-w-3xl space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-black hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-primary" />
              <span>Ana Sayfaya Dön</span>
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.2)]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Haftalık Antrenman Takvimi & Atölyeler</span>
            </div>

            <h1 className="font-sans text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl leading-[1.02]">
              Toplulukla Tanış, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
                Ritmine Katıl.
              </span>
            </h1>

            <p className="max-w-xl text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
              Tek başınalıktan çık, şehre karış. Birlikte hareket eden yeni nesil spor topluluğunun açık hava buluşmalarını keşfet.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-zinc-950/90 sticky top-16 z-40 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <Filter className="h-4 w-4 text-primary shrink-0 mr-2" />
              {availableBranches.map((branch) => (
                <button
                  key={branch}
                  onClick={() => setSelectedBranch(branch)}
                  className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                    selectedBranch === branch
                      ? 'bg-primary text-black shadow-[0_0_20px_rgba(249,115,22,0.4)] font-black'
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
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-zinc-900/80 px-5 py-2 text-xs font-bold uppercase tracking-wider text-zinc-200 hover:border-primary hover:text-primary transition-all"
            >
              <span>Instagram @orisecommunity</span>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-black via-zinc-950/60 to-black py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="mb-12 flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="font-sans text-2xl font-black text-white tracking-tight">Yaklaşan Buluşmalar & Antrenmanlar</h2>
            <div className="flex items-center gap-4">
              <button onClick={() => fetchEvents()} className="text-xs font-mono text-zinc-400 hover:text-primary uppercase tracking-widest cursor-pointer underline">
                Yenile
              </button>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                [{filteredEvents.length} ETKİNLİK]
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((evt) => {
              const alreadyJoined = myRegisteredEventIds.includes(evt.id)
              const eventDate = new Date(evt.date)
              const dayNum = eventDate.getDate()
              const monthName = eventDate.toLocaleString('tr-TR', { month: 'long' }).toUpperCase()
              const timeStr = eventDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

              return (
                <div
                  key={evt.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl transition-all duration-500 hover:border-primary/60 hover:bg-zinc-900/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-center shrink-0 w-20">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">{monthName}</span>
                        <span className="text-2xl font-black text-white leading-none my-1">{dayNum}</span>
                        <span className="text-[10px] text-zinc-400">{timeStr}</span>
                      </div>
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-950 border border-white/5">
                        <Image
                          src={evt.image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop'}
                          alt={evt.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-2.5 left-2.5 rounded-full border border-primary/40 bg-black/80 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                          {evt.branch || 'KULÜP'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-sans text-xl font-black text-white group-hover:text-primary transition-colors tracking-tight">
                        {evt.title}
                      </h3>
                      {evt.instructor_name && (
                        <p className="text-xs font-mono text-primary font-bold tracking-wider">
                          Eğitmen: {evt.instructor_name}
                        </p>
                      )}
                      
                      {/* HTML Açıklama Desteği */}
                      <div 
                        className="text-xs leading-relaxed text-zinc-400 line-clamp-3 prose prose-invert"
                        dangerouslySetInnerHTML={{ __html: evt.description }}
                      />
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-black/50 p-3 border border-white/5 text-xs font-mono text-zinc-300">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{evt.location || 'İstanbul'}</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-white/10 space-y-3">
                    {alreadyJoined ? (
                      <div className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 py-3.5 text-xs font-bold uppercase tracking-widest text-emerald-400">
                        <Check className="h-4 w-4" />
                        <span>Katılım Talebi Gönderildi</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openRegisterModal(evt)}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all hover:scale-[1.02] hover:bg-orange-500 cursor-pointer"
                      >
                        <span>Katılım Talebi Gönder</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}

                    <a
                      href="https://www.instagram.com/orisecommunity/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-zinc-900/80 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-300 hover:border-primary hover:text-white transition-all"
                    >
                      <span>Detaylar & Konum Instagram'da</span>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {isModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-xl animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-primary tracking-widest block">
                  {selectedEvent.branch}
                </span>
                <h3 className="font-sans text-lg font-black text-white mt-0.5">
                  {selectedEvent.title} — Katılım Talebi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {success ? (
              <div className="py-8 text-center space-y-3 animate-fadeIn">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <Check className="h-7 w-7" />
                </div>
                <h4 className="font-sans text-xl font-bold text-white">Katılım Talebiniz Alındı!</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Yönetici onayından sonra durum profilinize yansıyacaktır. Tüm detaylar için <a href="https://www.instagram.com/orisecommunity/" target="_blank" rel="noopener noreferrer" className="text-primary underline">@orisecommunity</a> hesabını takip edebilirsiniz!
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Ad Soyad</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ad Soyad" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Telefon</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">E-Posta</label>
                  <input type="email" value={userEmail} readOnly className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white opacity-75 cursor-not-allowed" />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5">
                    <input
                      type="checkbox" id="healthCheck" required checked={healthAccepted}
                      onChange={(e) => setHealthAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-black text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="healthCheck" className="text-[11px] leading-relaxed text-zinc-300">
                      Fiziksel antrenmanlara katılmaya engel bir sağlık problemim olmadığını beyan ederim.{' '}
                      <button type="button" onClick={() => setIsHealthModalOpen(true)} className="text-primary underline hover:text-white cursor-pointer">(Oku)</button>
                    </label>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5">
                    <input
                      type="checkbox" id="waiverCheck" required checked={waiverAccepted}
                      onChange={(e) => setWaiverAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-black text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="waiverCheck" className="text-[11px] leading-relaxed text-zinc-300">
                      <strong className="text-white">Feragatname & Sorumluluk Reddi:</strong> Kulüp etkinlikleri sırasındaki her türlü kaza ve zarardan bizzat sorumlu olduğumu kabul ederim.
                    </label>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5">
                    <input
                      type="checkbox" id="kvkkCheck" required checked={kvkkAccepted}
                      onChange={(e) => setKvkkAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-black text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="kvkkCheck" className="text-[11px] leading-relaxed text-zinc-300">
                      Fotoğraf ve videolarımın kulüp tanıtımlarında kullanılmasına onay veriyorum.{' '}
                      <button type="button" onClick={() => setIsKvkkModalOpen(true)} className="text-primary underline hover:text-white cursor-pointer">(Detaylar)</button>
                    </label>
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit" disabled={loading}
                  className="w-full rounded-full bg-primary py-4 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  {loading ? 'İşleniyor...' : 'Katılım Talebini Gönder'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {isHealthModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl" onClick={() => setIsHealthModalOpen(false)}>
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-primary font-bold text-xs uppercase flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Sağlık Beyanı</span>
              <button onClick={() => setIsHealthModalOpen(false)} className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">Kulüp etkinliklerine katılmama engel olacak, kalp, tansiyon veya ortopedik ciddi bir rahatsızlığım bulunmamaktadır.</p>
            <div className="text-right">
              <button type="button" onClick={() => { setHealthAccepted(true); setIsHealthModalOpen(false) }} className="rounded-full bg-primary px-6 py-2 text-xs font-bold uppercase text-black cursor-pointer font-bold">Onayla</button>
            </div>
          </div>
        </div>
      )}

      {isKvkkModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl" onClick={() => setIsKvkkModalOpen(false)}>
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 space-y-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-primary font-bold text-xs uppercase flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> KVKK & Medya Aydınlatma Metni</span>
              <button onClick={() => setIsKvkkModalOpen(false)} className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">6698 sayılı KVKK uyarınca bilgileriniz işlenmektedir ve medya izinleriniz onaylanmaktadır.</p>
            <div className="text-right">
              <button type="button" onClick={() => { setKvkkAccepted(true); setIsKvkkModalOpen(false) }} className="rounded-full bg-primary px-6 py-2 text-xs font-bold uppercase text-black cursor-pointer font-bold">Anladım / Onayla</button>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          checkUserSession()
        }}
      />
    </div>
  )
}
