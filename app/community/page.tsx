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
    <div className="relative min-h-screen bg-[#111111] text-[#F5F2EC] font-sans selection:bg-[#F74A05] selection:text-white">
      <SiteHeader />

      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden flex items-end pb-20 px-6 sm:px-12 lg:px-20 select-none border-b border-[#D8D6D2]/10 pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#111111]">
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent" />
        </div>

        <div className="absolute top-28 left-6 z-20 sm:left-10">
          <Link
            href="/store"
            className="inline-flex items-center gap-2 rounded-full border border-[#D8D6D2]/20 bg-[#111111]/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#F5F2EC] backdrop-blur-xl transition-all duration-300 hover:border-[#F74A05] hover:text-[#FFFFFF]"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-[#F74A05]" />
            <span>Mağazaya Dön</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-5xl space-y-6">
          <h1 className="font-['Vast_XXL',sans-serif] text-4xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#FFFFFF] uppercase leading-[1.1] sm:leading-[1.05]" style={{ letterSpacing: '-0.02em' }}>
            Toplulukla Tanış, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F74A05] via-orange-400 to-amber-300">
              Ritmine Katıl.
            </span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base text-[#D8D6D2] leading-relaxed font-normal">
            Tek başınalıktan çık, şehre karış. Birlikte hareket eden yeni nesil spor topluluğunun açık hava buluşmalarını keşfet.
          </p>
        </div>
      </section>

      <section className="border-b border-[#D8D6D2]/10 bg-[#111111]/90 sticky top-16 sm:top-20 z-40 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <Filter className="h-4 w-4 text-[#F74A05] shrink-0 mr-2" />
              {availableBranches.map((branch) => (
                <button
                  key={branch}
                  onClick={() => setSelectedBranch(branch)}
                  className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                    selectedBranch === branch
                      ? 'bg-[#F74A05] text-[#111111] shadow-[0_0_20px_rgba(247,74,5,0.4)] font-black'
                      : 'border border-[#D8D6D2]/15 bg-[#111111]/60 text-[#D8D6D2] hover:border-[#F74A05]/50 hover:text-[#FFFFFF]'
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
              className="inline-flex items-center gap-2 rounded-full border border-[#D8D6D2]/20 bg-[#111111]/80 px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#F5F2EC] hover:border-[#F74A05] hover:text-[#F74A05] transition-all"
            >
              <span>Instagram @orisecommunity</span>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#111111] via-[#111111]/80 to-[#111111] py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="mb-12 flex items-center justify-between border-b border-[#D8D6D2]/10 pb-4">
            <h2 className="font-['Vast_XXL',sans-serif] text-2xl font-black text-[#FFFFFF] tracking-tight">Yaklaşan Buluşmalar & Antrenmanlar</h2>
            <div className="flex items-center gap-4">
              <button onClick={() => fetchEvents()} className="text-xs font-mono text-[#D8D6D2] hover:text-[#F74A05] uppercase tracking-widest cursor-pointer underline">
                Yenile
              </button>
              <span className="text-xs font-mono text-[#D8D6D2] uppercase tracking-widest">
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
              const dayName = eventDate.toLocaleString('tr-TR', { weekday: 'long' }).toUpperCase()
              const timeStr = eventDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

              const evtRegs = registrations.filter(r => r.event_id === evt.id && r.status === 'approved')
              const capacity = evt.capacity || 30
              const isFull = evtRegs.length >= capacity

              return (
                <div
                  key={evt.id}
                  onClick={() => openDetailModal(evt)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#D8D6D2]/15 bg-[#111111]/60 p-6 backdrop-blur-xl transition-all duration-500 hover:border-[#F74A05]/60 hover:bg-[#111111] shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer"
                >
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      {/* Tarih ve Gün Rozeti */}
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#F74A05]/30 bg-[#F74A05]/10 px-3 py-3 text-center shrink-0 w-24">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#F74A05] font-bold">{monthName}</span>
                        <span className="text-2xl font-black text-[#FFFFFF] leading-none my-1">{dayNum}</span>
                        <span className="text-[10px] font-mono text-[#F74A05] font-extrabold uppercase">{dayName}</span>
                        <span className="text-[10px] text-[#D8D6D2] mt-0.5">{timeStr}</span>
                      </div>
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#111111] border border-[#D8D6D2]/10">
                        <Image
                          src={evt.image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop'}
                          alt={evt.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-2.5 left-2.5 rounded-full border border-[#F74A05]/40 bg-[#111111]/80 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#F74A05] backdrop-blur-md">
                          {evt.branch || 'KULÜP'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-['Vast_XXL',sans-serif] text-xl font-bold text-[#FFFFFF] group-hover:text-[#F74A05] transition-colors tracking-tight">
                          {evt.title}
                        </h3>
                        <span className="text-[10px] font-mono bg-[#D8D6D2]/10 text-[#D8D6D2] px-2.5 py-1 rounded-full border border-[#D8D6D2]/15">
                          👥 {evtRegs.length}/{capacity}
                        </span>
                      </div>

                      {evt.instructor_name && (
                        <p className="text-xs font-mono text-[#F74A05] font-bold tracking-wider">
                          Eğitmen: {evt.instructor_name}
                        </p>
                      )}
                      
                      <div 
                        className="text-xs text-[#D8D6D2] leading-snug h-12 overflow-hidden text-ellipsis [&_*]:text-xs [&_*]:text-[#D8D6D2] [&_*]:m-0"
                        dangerouslySetInnerHTML={{ __html: evt.description }}
                      />
                      <span className="text-[10px] font-mono text-[#F74A05] inline-flex items-center gap-1 pt-1 font-bold">
                        <Info size={12} /> Detayları Gör / Büyüt
                      </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-[#111111]/80 p-3 border border-[#D8D6D2]/10 text-xs font-mono text-[#D8D6D2]">
                      <MapPin className="h-4 w-4 text-[#F74A05] shrink-0" />
                      <span className="truncate">{evt.location || 'İstanbul'}</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-[#D8D6D2]/10 space-y-3" onClick={(e) => e.stopPropagation()}>
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
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#F74A05] py-3.5 text-xs font-bold uppercase tracking-widest text-[#111111] shadow-[0_0_25px_rgba(247,74,5,0.4)] transition-all hover:scale-[1.02] hover:bg-orange-600 cursor-pointer font-black"
                      >
                        <span>Katılım Talebi Gönder</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}

                    <a
                      href="https://www.instagram.com/orisecommunity/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-[#D8D6D2]/20 bg-[#111111] py-3 text-[11px] font-bold uppercase tracking-wider text-[#D8D6D2] hover:border-[#F74A05] hover:text-[#FFFFFF] transition-all"
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

      {isDetailModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-xl animate-fadeIn"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl border border-[#D8D6D2]/20 bg-[#111111] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#D8D6D2]/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#F74A05] tracking-widest block font-bold">
                  {selectedEvent.branch}
                </span>
                <h3 className="font-['Vast_XXL',sans-serif] text-2xl font-black text-[#FFFFFF] mt-1">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#FFFFFF] hover:bg-[#F74A05] hover:text-[#111111] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#111111] border border-[#D8D6D2]/10">
              <Image
                src={selectedEvent.image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop'}
                alt={selectedEvent.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 rounded-xl bg-[#111111] p-3 border border-[#D8D6D2]/10 text-[#D8D6D2]">
                <Calendar className="h-4 w-4 text-[#F74A05] shrink-0" />
                <span>{new Date(selectedEvent.date).toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-[#111111] p-3 border border-[#D8D6D2]/10 text-[#D8D6D2]">
                <MapPin className="h-4 w-4 text-[#F74A05] shrink-0" />
                <span className="truncate">{selectedEvent.location || 'İstanbul'}</span>
              </div>
            </div>

            {selectedEvent.instructor_name && (
              <p className="text-xs font-mono text-[#F74A05] font-bold">
                Eğitmen / Lider: {selectedEvent.instructor_name}
              </p>
            )}

            <div 
              className="text-sm leading-relaxed text-[#D8D6D2] space-y-3 bg-[#111111]/80 p-4 rounded-2xl border border-[#D8D6D2]/10"
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
                      className="flex-1 rounded-full bg-[#F74A05] py-3.5 text-xs font-bold uppercase tracking-widest text-[#111111] shadow-[0_0_25px_rgba(247,74,5,0.4)] hover:bg-orange-600 transition-all cursor-pointer font-black"
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
            className="relative w-full max-w-lg rounded-3xl border border-[#D8D6D2]/20 bg-[#111111] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#D8D6D2]/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#F74A05] tracking-widest block">
                  {selectedEvent.branch}
                </span>
                <h3 className="font-['Vast_XXL',sans-serif] text-lg font-black text-[#FFFFFF] mt-0.5">
                  {selectedEvent.title} — Katılım Talebi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[#FFFFFF] hover:bg-[#F74A05] hover:text-[#111111] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {success ? (
              <div className="py-8 text-center space-y-3 animate-fadeIn">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <Check className="h-7 w-7" />
                </div>
                <h4 className="font-['Vast_XXL',sans-serif] text-xl font-bold text-[#FFFFFF]">Katılım Talebiniz Alındı!</h4>
                <p className="text-xs text-[#D8D6D2] max-w-xs mx-auto">
                  Yönetici onayından sonra durum profilinize yansıyacaktır. Tüm detaylar için <a href="https://www.instagram.com/orisecommunity/" target="_blank" rel="noopener noreferrer" className="text-[#F74A05] underline">@orisecommunity</a> hesabını takip edebilirsiniz!
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#D8D6D2] block mb-1">Ad Soyad</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ad Soyad" className="w-full rounded-xl border border-[#D8D6D2]/20 bg-[#111111] px-4 py-3 text-xs text-[#FFFFFF] focus:border-[#F74A05] focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#D8D6D2] block mb-1">Telefon</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" className="w-full rounded-xl border border-[#D8D6D2]/20 bg-[#111111] px-4 py-3 text-xs text-[#FFFFFF] focus:border-[#F74A05] focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#D8D6D2] block mb-1">E-Posta</label>
                  <input type="email" value={userEmail} readOnly className="w-full rounded-xl border border-[#D8D6D2]/20 bg-[#111111]/60 px-4 py-3 text-xs text-[#FFFFFF] opacity-75 cursor-not-allowed" />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 rounded-2xl border border-[#D8D6D2]/15 bg-[#111111] p-3.5">
                    <input
                      type="checkbox" id="healthCheck" required checked={healthAccepted}
                      onChange={(e) => setHealthAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-black text-[#F74A05] focus:ring-[#F74A05] cursor-pointer"
                    />
                    <label htmlFor="healthCheck" className="text-[11px] leading-relaxed text-[#D8D6D2]">
                      Fiziksel antrenmanlara katılmaya engel bir sağlık problemim olmadığını beyan ederim.{' '}
                      <button type="button" onClick={() => setIsHealthModalOpen(true)} className="text-[#F74A05] underline hover:text-[#FFFFFF] cursor-pointer">(Oku)</button>
                    </label>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-[#D8D6D2]/15 bg-[#111111] p-3.5">
                    <input
                      type="checkbox" id="waiverCheck" required checked={waiverAccepted}
                      onChange={(e) => setWaiverAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-black text-[#F74A05] focus:ring-[#F74A05] cursor-pointer"
                    />
                    <label htmlFor="waiverCheck" className="text-[11px] leading-relaxed text-[#D8D6D2]">
                      <strong className="text-[#FFFFFF]">Feragatname & Sorumluluk Reddi:</strong> Kulüp etkinlikleri sırasındaki her türlü kaza ve zarardan bizzat sorumlu olduğumu kabul ederim.
                    </label>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-[#D8D6D2]/15 bg-[#111111] p-3.5">
                    <input
                      type="checkbox" id="kvkkCheck" required checked={kvkkAccepted}
                      onChange={(e) => setKvkkAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-black text-[#F74A05] focus:ring-[#F74A05] cursor-pointer"
                    />
                    <label htmlFor="kvkkCheck" className="text-[11px] leading-relaxed text-[#D8D6D2]">
                      Fotoğraf ve videolarımın kulüp tanıtımlarında kullanılmasına onay veriyorum.{' '}
                      <button type="button" onClick={() => setIsKvkkModalOpen(true)} className="text-[#F74A05] underline hover:text-[#FFFFFF] cursor-pointer">(Detaylar)</button>
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
                  className="w-full rounded-full bg-[#F74A05] py-4 text-xs font-bold uppercase tracking-widest text-[#111111] shadow-[0_0_25px_rgba(247,74,5,0.4)] hover:scale-[1.02] transition-transform cursor-pointer font-black"
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
          <div className="relative w-full max-w-lg rounded-3xl border border-[#D8D6D2]/20 bg-[#111111] p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#D8D6D2]/10 pb-3">
              <span className="text-[#F74A05] font-bold text-xs uppercase flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Sağlık Beyanı</span>
              <button onClick={() => setIsHealthModalOpen(false)} className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-[#FFFFFF] cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-xs text-[#D8D6D2] leading-relaxed">Kulüp etkinliklerine katılmama engel olacak, kalp, tansiyon veya ortopedik ciddi bir rahatsızlığım bulunmamaktadır.</p>
            <div className="text-right">
              <button type="button" onClick={() => { setHealthAccepted(true); setIsHealthModalOpen(false) }} className="rounded-full bg-[#F74A05] px-6 py-2 text-xs font-bold uppercase text-[#111111] cursor-pointer font-black">Onayla</button>
            </div>
          </div>
        </div>
      )}

      {isKvkkModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl" onClick={() => setIsKvkkModalOpen(false)}>
          <div className="relative w-full max-w-lg rounded-3xl border border-[#D8D6D2]/20 bg-[#111111] p-6 space-y-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#D8D6D2]/10 pb-3">
              <span className="text-[#F74A05] font-bold text-xs uppercase flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> KVKK & Medya Aydınlatma Metni</span>
              <button onClick={() => setIsKvkkModalOpen(false)} className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-[#FFFFFF] cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-xs text-[#D8D6D2] leading-relaxed">6698 sayılı KVKK uyarınca bilgileriniz işlenmektedir ve medya izinleriniz onaylanmaktadır.</p>
            <div className="text-right">
              <button type="button" onClick={() => { setKvkkAccepted(true); setIsKvkkModalOpen(false) }} className="rounded-full bg-[#F74A05] px-6 py-2 text-xs font-bold uppercase text-[#111111] cursor-pointer font-black">Anladım / Onayla</button>
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
