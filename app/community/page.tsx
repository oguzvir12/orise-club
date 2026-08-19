'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Check,
  ShieldCheck,
  AlertCircle,
  X,
  Sparkles,
  Ticket,
  ChevronRight,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface EventItem {
  id: string
  title: string
  branch: string
  event_date: string
  location: string
  capacity: number
  price: number // 0 = Ücretsiz, >0 = Ücretli Bilet Altyapısı
  description: string
  image: string
}

// Varsayılan Kulüp Etkinlikleri (Veritabanı boşsa devreye girer)
const DEFAULT_EVENTS: EventItem[] = [
  {
    id: 'evt-cadde-run-01',
    title: 'Caddebostan Sahil Sunset Run',
    branch: 'KOŞU',
    event_date: 'Cumartesi, 19:00',
    location: 'Caddebostan Sahil Etkinlik Alanı',
    capacity: 25,
    price: 0,
    description:
      '5K ve 8K iki farklı tempo grubuyla gün batımı koşusu. Isınma ve soğuma esnemeleri dahil.',
    image:
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'evt-moda-yoga-01',
    title: 'Moda Sahil Morning Flow Yoga',
    branch: 'YOGA & MOBILITY',
    event_date: 'Pazar, 09:30',
    location: 'Moda Parkı Çim Alan',
    capacity: 20,
    price: 0,
    description:
      'Koşucular ve sporcular için dinamik mobilite ve esneme seansı. Matını kap gel.',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'evt-kalamis-tennis-01',
    title: 'Kalamış Kortları Mix Tenis Buluşması',
    branch: 'TENİS',
    event_date: 'Çarşamba, 20:00',
    location: 'Kalamış Atatürk Parkı Kortları',
    capacity: 12,
    price: 0,
    description:
      'Orta ve ileri seviye çiftler maç turnuvası. Top ve kort rezervasyonu kulüp tarafından sağlanır.',
    image:
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1200&auto=format&fit=crop',
  },
]

export default function CommunityPage() {
  const [events, setEvents] = useState<EventItem[]>(DEFAULT_EVENTS)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false)

  // Kayıt Formu State'leri
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [healthAccepted, setHealthAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Katılımcı Sayıları (Canlı Sayaç)
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('status', 'confirmed')

      if (!error && data) {
        const counts: Record<string, number> = {}
        data.forEach((r: any) => {
          counts[r.event_id] = (counts[r.event_id] || 0) + 1
        })
        setRegistrationCounts(counts)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const openRegisterModal = (evt: EventItem) => {
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

    setLoading(true)
    setErrorMsg('')

    try {
      const currentCount = registrationCounts[selectedEvent.id] || 0
      const isWaitlist = currentCount >= selectedEvent.capacity

      const { error } = await supabase.from('event_registrations').insert([
        {
          event_id: selectedEvent.id,
          full_name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          status: isWaitlist ? 'waitlist' : 'confirmed',
        },
      ])

      if (error) throw error

      setSuccess(true)
      setFullName('')
      setPhone('')
      setEmail('')
      setHealthAccepted(false)
      fetchRegistrations()

      setTimeout(() => {
        setIsModalOpen(false)
        setSuccess(false)
      }, 3000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Kayıt sırasında bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
      {/* Sol Üst Ana Sayfa Butonu */}
      <div className="fixed top-4 left-6 z-[60] sm:left-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-black hover:text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.35)]"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Ana Sayfa</span>
        </Link>
      </div>

      {/* 1. HERO BAŞLIK */}
      <section className="relative overflow-hidden border-b border-white/10 pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/community-hero.jpeg"
            alt="ORISE Community"
            fill
            priority
            className="object-cover opacity-20 grayscale contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span>HAFTALIK ANTRENMAN TAKVİMİ</span>
            </div>

            <h1 className="font-sans text-4xl font-black tracking-tighter text-white sm:text-6xl lg:text-7xl leading-[1.05]">
              Birlikte Koş,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
                Şehri Hisset.
              </span>
            </h1>

            <p className="text-base font-normal leading-relaxed text-zinc-300 sm:text-lg">
              ORISE Community buluşmalarına katıl, kontenjanını ayırt ve antrenman gününde kulüple buluş.
            </p>
          </div>
        </div>
      </section>

      {/* 2. ETKİNLİK LİSTESİ */}
      <section className="border-b border-white/10 bg-zinc-950/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="font-sans text-2xl font-black text-white">Aktif Kulüp Buluşmaları</h2>
            <span className="text-xs font-mono text-zinc-500 uppercase">
              [{events.length} BULUŞMA]
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((evt) => {
              const enrolled = registrationCounts[evt.id] || 0
              const remaining = Math.max(0, evt.capacity - enrolled)
              const isFull = remaining === 0

              return (
                <div
                  key={evt.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-md transition-all duration-500 hover:border-primary/60 hover:bg-zinc-900/80 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]"
                >
                  <div className="space-y-4">
                    {/* Görsel & Branş */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-950">
                      <Image
                        src={evt.image}
                        alt={evt.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 rounded-full border border-primary/40 bg-black/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                        {evt.branch}
                      </div>

                      <div className="absolute bottom-3 right-3 rounded-full bg-black/80 border border-white/10 px-3 py-1 text-[10px] font-mono text-zinc-300 backdrop-blur-md">
                        {isFull ? (
                          <span className="text-amber-400 font-bold">KONTENJAN DOLDU (YEDEK LİSTE)</span>
                        ) : (
                          <span>Son {remaining} Kişilik Kontenjan</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-sans text-xl font-black text-white group-hover:text-primary transition-colors">
                        {evt.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                        {evt.description}
                      </p>
                    </div>

                    {/* Detaylar */}
                    <div className="space-y-2 rounded-xl bg-black/40 p-3 border border-white/5 text-xs font-mono text-zinc-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>{evt.event_date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="h-3.5 w-3.5 text-primary" />
                        <span>
                          {evt.price === 0 ? 'Ücretsiz / Kulüp Etkinliği' : `₺${evt.price} (Biletli)`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Katıl Butonu */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => openRegisterModal(evt)}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-transform hover:scale-[1.02]"
                    >
                      <span>{isFull ? 'Yedek Listeye Katıl' : 'Hemen Kaydol'}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. KAYIT MODALI & SAĞLIK BEYANI */}
      {isModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-xl animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Başlık */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-primary tracking-widest block">
                  {selectedEvent.branch} · ETKİNLİK REZERVASYONU
                </span>
                <h3 className="font-sans text-lg font-black text-white mt-0.5">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {success ? (
              <div className="py-8 text-center space-y-3 animate-fadeIn">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <Check className="h-7 w-7" />
                </div>
                <h4 className="font-sans text-xl font-bold text-white">Kaydın Başarıyla Alındı!</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Buluşma günü ve saatinde etkinlik noktasında olman yeterlidir. Detaylar SMS / Mail ile iletilecektir.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Örn: Burak Tan"
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Telefon Numarası (WhatsApp Teyidi İçin)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    E-Posta Adresi
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="adiniz@gmail.com"
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
                  />
                </div>

                {/* YASAL SAĞLIK VE SORUMLULUK ONAY KUTUSU */}
                <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="healthCheck"
                      required
                      checked={healthAccepted}
                      onChange={(e) => setHealthAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-black text-primary focus:ring-primary"
                    />
                    <label htmlFor="healthCheck" className="text-[11px] leading-relaxed text-zinc-300">
                      Fiziksel antrenmana katılmaya engel bir sağlık problemim olmadığını beyan eder, etkinlik sırasındaki tüm kişisel sorumluluğu kabul ederim.{' '}
                      <button
                        type="button"
                        onClick={() => setIsHealthModalOpen(true)}
                        className="text-primary underline hover:text-white"
                      >
                        (Sağlık & Sorumluluk Beyanını Oku)
                      </button>
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
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {loading ? 'Kayıt Yapılıyor...' : 'Katılımımı Onayla'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. SAĞLIK BEYANI & SORUMLULUK DETAY POP-UP */}
      {isHealthModalOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-xl animate-fadeIn"
          onClick={() => setIsHealthModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>Sağlık Beyanı & Sorumluluk Muvafakatnamesi</span>
              </div>
              <button
                type="button"
                onClick={() => setIsHealthModalOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs leading-relaxed text-zinc-300 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              <p>
                <strong>1. Sağlık Durumu:</strong> ORISE Community tarafından düzenlenen koşu, yoga, tenis, pilates ve benzeri sportif faaliyetlere katılmama engel olacak bilinen kalp, solunum, tansiyon veya eklem rahatsızlığım bulunmamaktadır.
              </p>
              <p>
                <strong>2. Şahsi Sorumluluk:</strong> Etkinlik sırasında gerçekleşebilecek olası burkulma, düşme veya fiziksel sakatlıklarda ilk yardım ve yönlendirmelerin sporcu olarak kendi iradem dahilinde olduğunu, kulüp organizatörlerinin şahsi kusur harici durumlardan sorumlu tutulamayacağını kabul ederim.
              </p>
              <p>
                <strong>3. Görsel ve Medya İzni:</strong> Etkinlik süresince kulüp tanıtımı ve topluluk arşivi için çekilen fotoğraf ve video kayıtlarında yer almayı kabul ederim.
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => {
                  setHealthAccepted(true)
                  setIsHealthModalOpen(false)
                }}
                className="rounded-full bg-primary px-6 py-2 text-xs font-bold uppercase text-black hover:scale-105 transition-transform"
              >
                Okudum, Onaylıyorum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
