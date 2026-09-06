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
  Info,
  Users,
  Lock,
  ShoppingBag
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
  const [registrations, setRegistrations] = useState<any[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>('TÜMÜ')
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
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
      const { data: evtData } = await supabase.from('events').select('*').order('date', { ascending: true })
      if (evtData) setEvents(evtData)

      const { data: regData } = await supabase.from('event_registrations').select('*')
      if (regData) setRegistrations(regData)
    } catch (e) {
      console.error(e)
    }
  }

  const openRegisterModal = (evt: EventItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
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

  const openDetailModal = (evt: EventItem) => {
    setSelectedEvent(evt)
    setIsDetailModalOpen(true)
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
      const eventRegs = registrations.filter(r => r.event_id === selectedEvent.id && r.status === 'approved')
      const capacity = selectedEvent.capacity || 30
      if (eventRegs.length >= capacity) {
        setErrorMsg('Üzgünüz, bu etkinliğin kontenjanı dolmuştur!')
        setLoading(false)
        return
      }

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
      fetchEvents()
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

      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden flex items-end pb-20 px-6 sm:px-12 lg:px-20 select-none border-b border-white/10 pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute inset-0 h-full w-full object-cover object-center scale-105 brightness-90 contrast-110"
          >
            <source src="/community-hero-video.mp4" type="video/mp4" />
            Tarayıcınız video etiketini desteklemiyor.
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="absolute top-28 left-6 z-20 sm:left-10">
          <Link
            href="/store"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:text-white"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-primary" />
            <span>Mağazaya Dön</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-5xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.2)]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Haftalık Antrenman Takvimi & Atölyeler</span>
          </div>

          <h1 className="font-sans text-4xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[1.1] sm:leading-[1.05]" style={{ letterSpacing: '-0.02em' }}>
            Toplulukla Tanış, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
              Ritmine Katıl.
            </span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
            Tek başınalıktan çık, şehre karış. Birlikte hareket eden yeni nesil spor topluluğunun açık hava buluşmalarını keşfet.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-zinc-950/90 sticky top-20 z-40 backdrop-blur-2xl">
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

              const evtRegs = registrations.filter(r => r.event_id === evt.id && r.status === 'approved')
              const capacity = evt.capacity || 30
              const isFull = evtRegs.length >= capacity

              return (
                <div
                  key={evt.id}
                  onClick={() => openDetailModal(evt)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl transition-all duration-500 hover:border-primary/60 hover:bg-zinc-900/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer"
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
                      <div className="flex items-center justify-between">
                        <h3 className="font-sans text-xl font-black text-white group-hover:text-primary transition-colors tracking-tight">
                          {evt.title}
                        </h3>
                        <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full border border-white/10">
                          👥 {evtRegs.length}/{capacity}
                        </span>
                      </div>

                      {evt.instructor_name && (
                        <p className="text-xs font-mono text-primary font-bold tracking-wider">
                          Eğitmen: {evt.instructor_name}
                        </p>
                      )}
                      
                      <div 
                        className="text-xs text-zinc-300 leading-snug h-12 overflow-hidden text-ellipsis [&_*]:text-xs [&_*]:text-zinc-300 [&_*]:m-0"
                        dangerouslySetInnerHTML={{ __html: evt.description }}
                      />
                      <span className="text-[10px] font-mono text-primary inline-flex items-center gap-1 pt-1 font-bold">
                        <Info size={12} /> Detayları Gör / Büyüt
                      </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-black/50 p-3 border border-white/5 text-xs font-mono text-zinc-300">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{evt.location || 'İstanbul'}</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-white/10 space-y-3" onClick={(e) => e.stopPropagation()}>
                    {alreadyJoined ? (
                      <div className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 py-3.5 text-xs font-bold uppercase tracking-widest text-emerald-400">
                        <Check className="h-4 w-4" />
                        <span>Katılım Talebi Gönderildi</span>
                      </div>
                    ) : isFull ? (
                      <div className="flex w-full items-center justify-center gap-2 rounded-full bg-red-500/20 border border-red-500/40 py-3.5 text-xs font-bold uppercase tracking-widest text-red-400">
                        <Lock className="h-4 w-4" />
                        <span>Kontenjan Doldu</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => openRegisterModal(evt, e)}
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

      {/* SAĞ ALT: WhatsApp İletişim Butonu (+90 507 082 08 00) */}
      <div className="fixed bottom-6 right-6 z-[90]">
        <a 
          href="https://wa.me/905070820800?text=Merhaba,%20ORISE%20Club%20hakkında%20bilgi%20almak%20istiyorum." 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-105 transition-transform cursor-pointer"
          aria-label="WhatsApp Destek"
        >
          <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>
      </div>

      {isDetailModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-xl animate-fadeIn"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-primary tracking-widest block font-bold">
                  {selectedEvent.branch}
                </span>
                <h3 className="font-sans text-2xl font-black text-white mt-1">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-900 border border-white/10">
              <Image
                src={selectedEvent.image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop'}
                alt={selectedEvent.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 rounded-xl bg-black/60 p-3 border border-white/5 text-zinc-300">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <span>{new Date(selectedEvent.date).toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-black/60 p-3 border border-white/5 text-zinc-300">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{selectedEvent.location || 'İstanbul'}</span>
              </div>
            </div>

            {selectedEvent.instructor_name && (
              <p className="text-xs font-mono text-primary font-bold">
                Eğitmen / Lider: {selectedEvent.instructor_name}
              </p>
            )}

            <div 
              className="text-sm leading-relaxed text-zinc-300 space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5"
              dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
            />

            <div className="pt-4 flex gap-3">
              {(() => {
                const evtRegs = registrations.filter(r => r.event_id === selectedEvent.id && r.status === 'approved')
                const isFull = evtRegs.length >= (selectedEvent.capacity || 30)
                const alreadyJoined = myRegisteredEventIds.includes(selectedEvent.id)

                if (alreadyJoined) {
                  return (
                    <div className="flex-1 flex items-center justify-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 py-3.5 text-xs font-bold uppercase tracking-widest text-emerald-400">
                      <Check className="h-4 w-4" /> Katılım Talebi Gönderildi
                    </div>
                  )
                } else if (isFull) {
                  return (
                    <div className="flex-1 flex items-center justify-center gap-2 rounded-full bg-red-500/20 border border-red-500/40 py-3.5 text-xs font-bold uppercase tracking-widest text-red-400">
                      <Lock className="h-4 w-4" /> Kontenjan Doldu
                    </div>
                  )
                } else {
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        setIsDetailModalOpen(false)
                        openRegisterModal(selectedEvent)
                      }}
                      className="flex-1 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:bg-orange-500 transition-all cursor-pointer"
                    >
                      Katılım Talebi Gönder
                    </button>
                  )
                }
              })()}
            </div>
          </div>
        </div>
      )}

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
