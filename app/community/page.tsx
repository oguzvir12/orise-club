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
  Ticket,
  ChevronRight,
  Filter,
  User,
  LogOut,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import AuthModal from '../../auth-modal' // root/components içindeki dosyaya doğru relative yol

interface EventItem {
  id: string
  title: string
  branch: string
  date: string
  location: string
  capacity: number
  price: number
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const [session, setSession] = useState<any>(null)
  const [userEmail, setUserEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [healthAccepted, setHealthAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({})
  const [myRegisteredEventIds, setMyRegisteredEventIds] = useState<string[]>([])

  useEffect(() => {
    fetchEvents()
    fetchRegistrations()
    checkUserSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      if (currentSession?.user?.email) {
        setUserEmail(currentSession.user.email)
        fetchUserData(currentSession.user.email)
        fetchMyRegistrations(currentSession.user.email)
      } else {
        setUserEmail('')
        setFullName('')
        setPhone('')
        setMyRegisteredEventIds([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUserSession = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      setSession(currentSession)
      if (currentSession?.user?.email) {
        const emailVal = currentSession.user.email
        setUserEmail(emailVal)
        await fetchUserData(emailVal)
        await fetchMyRegistrations(emailVal)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchUserData = async (email: string) => {
    try {
      const { data: prof } = await supabase.from('profiles').select('*').ilike('email', email).single()
      if (prof) {
        setFullName(prof.full_name || '')
        setPhone(prof.phone || '')
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

  const fetchRegistrations = async () => {
    try {
      const { data } = await supabase.from('event_registrations').select('event_id')
      if (data) {
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
    if (!userEmail) {
      setIsAuthModalOpen(true)
      return
    }
    if (myRegisteredEventIds.includes(evt.id)) {
      alert('Bu etkinliğe zaten katıldın!')
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
    if (!healthAccepted) {
      setErrorMsg('Lütfen sağlık ve sorumluluk beyanını onaylayınız.')
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
        setErrorMsg('Bu etkinliğe zaten kayıt oluşturdun!')
        setLoading(false)
        return
      }
      const currentCount = registrationCounts[selectedEvent.id] || 0
      const isWaitlist = currentCount >= (selectedEvent.capacity || 30)
      const { error } = await supabase.from('event_registrations').insert([
        {
          event_id: selectedEvent.id,
          full_name: fullName.trim() || 'Kulüp Üyesi',
          phone: phone.trim() || 'Belirtilmemiş',
          email: userEmail.trim(),
          status: isWaitlist ? 'waitlist' : 'pending',
          is_paid: Number(selectedEvent.price) === 0,
        },
      ])
      if (error) throw error
      setSuccess(true)
      setHealthAccepted(false)
      fetchRegistrations()
      fetchMyRegistrations(userEmail)
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

  const filteredEvents =
    selectedBranch === 'TÜMÜ'
      ? events
      : events.filter((e) => e.branch?.toUpperCase() === selectedBranch)

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
        <Link href="/" className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-black hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Ana Sayfa</span>
        </Link>
        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary backdrop-blur-xl transition-all duration-300 hover:bg-primary hover:text-black">
                <User className="h-3.5 w-3.5" />
                <span>Profilim & Etkinliklerim</span>
              </Link>
              <button type="button" onClick={async () => { await supabase.auth.signOut(); window.location.reload() }} className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/20 cursor-pointer">
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setIsAuthModalOpen(true)} className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:scale-105 transition-transform cursor-pointer">
              Giriş Yap / Kayıt Ol
            </button>
          )}
        </div>
      </header>

      {/* ... (Diğer UI kodların aynı kalmalı) */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={() => checkUserSession()} />
    </div>
  )
}
