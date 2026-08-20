'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Users,
  Trash2,
  RefreshCw,
  Lock,
  LogOut,
  PlusCircle,
  Layers,
  Edit3,
  X,
  Upload,
  Calendar,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Admin kullanıcı listesi (değişiklik yok)
const ADMIN_USERS: Record<string, { pass: string; branch: string; title: string; type: 'community' | 'store' | 'super' | 'community_director' }> = {
  orise_master_admin: { pass: 'Orise#2026_SecureKey!99', branch: 'ALL', title: 'Süper Admin (Tüm Yetkiler)', type: 'super' },
  // ... diğerleri aynı kalabilir
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // ... (Eski state'ler aynı kalıyor: title, price, evtTitle vb.)
  const [editingEvent, setEditingEvent] = useState<any | null>(null)
  const [editEvtTitle, setEditEvtTitle] = useState('')
  const [editEvtPrice, setEditEvtPrice] = useState('')
  const [editEvtBranch, setEditEvtBranch] = useState('KOŞU')
  const [editEvtLocation, setEditEvtLocation] = useState('')
  const [editEvtDate, setEditEvtDate] = useState('')
  const [editEvtInstructor, setEditEvtInstructor] = useState('')
  const [editEvtImage, setEditEvtImage] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      // Katılımcıları çekerken event title'ı da çekiyoruz
      const { data: regData } = await supabase.from('event_registrations').select('*, events(title)')
      if (regData) setRegistrations(regData)

      const { data: prodData } = await supabase.from('products').select('*')
      if (prodData) setProducts(prodData)

      const { data: evtData } = await supabase.from('events').select('*')
      if (evtData) setEvents(evtData)

      const { data: profData } = await supabase.from('profiles').select('*')
      if (profData) setProfiles(profData)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // ETKİNLİK DÜZENLEME FONKSİYONU
  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEvent) return

    const { error } = await supabase.from('events').update({
      title: editEvtTitle,
      price: Number(editEvtPrice),
      branch: editEvtBranch,
      location: editEvtLocation,
      date: editEvtDate, // Senin tablonda 'date' olarak görünüyor
      instructor_name: editEvtInstructor,
      image_url: editEvtImage
    }).eq('id', editingEvent.id)

    if (!error) {
      alert('Etkinlik güncellendi!')
      setEditingEvent(null)
      fetchData()
    } else {
      alert('Hata: ' + error.message)
    }
  }

  // ... (Giriş, çıkış, silme fonksiyonları aynı)

  // RENDER KISMI: Katılımcı Tablosunu E-posta Gösterecek Şekilde Güncelledim
  // ... (Tüm return yapısı aynı kalıyor, sadece tablo kısmını şöyle değiştir)

  // ETKİNLİK KATILIMCILARI TABLOSU
  /*
    <tbody className="divide-y divide-white/5 text-zinc-300">
      {registrations.map((reg) => (
        <tr key={reg.id}>
          <td className="p-4">{reg.full_name}</td>
          <td className="p-4">{reg.email}</td> {/* E-posta burada */}
          <td className="p-4">{reg.events?.title}</td> {/* Etkinlik başlığı */}
          <td className="p-4">{reg.status}</td>
          <td className="p-4"><button onClick={() => handleDeleteRegistration(reg.id)}><Trash2 size={14} /></button></td>
        </tr>
      ))}
    </tbody>
  */

  // ... (Geri kalan kısım aynı, sadece yukarıdaki düzenlemeleri uygula)
}
