'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Trash2,
  Lock,
  LogOut,
  PlusCircle,
  Layers,
  Edit3,
  X,
  Upload,
  ShoppingBag,
  HelpCircle,
  Send,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Users
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const BAD_WORDS = [
  'orospu', 'oç', 'amk', 'aq', 'sik', 'yarrak', 'piç', 'pezevenk', 'kahpe', 
  'göt', 'andeaval', 'salak', 'mal', 'gerizekalı', 'aptal', 'ibne', 'götveren'
] 

function containsBadWord(text: string): boolean {
  const lower = text.toLowerCase()
  return BAD_WORDS.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i')
    return regex.test(lower) || lower.includes(word)
  })
}

const PRESET_COLORS = [
  { name: 'Siyah', hex: '#000000' },
  { name: 'Beyaz', hex: '#FFFFFF' },
  { name: 'Gri', hex: '#6b7280' },
  { name: 'Turuncu', hex: '#f97316' },
  { name: 'Lacivert', hex: '#1e3a8a' },
  { name: 'Haki', hex: '#3f6212' },
]

const CATEGORY_OPTIONS = [
  { id: 'tshirt', label: 'T-Shirt', group: 'Üst Giyim' },
  { id: 'tank', label: 'Koşu Atleti / Singlet', group: 'Üst Giyim' },
  { id: 'sweatshirt', label: 'Sweatshirt & Hoodie', group: 'Üst Giyim' },
  { id: 'shorts', label: 'Performans Şort', group: 'Alt Giyim' },
  { id: 'leggings', label: 'Tayt (Leggings)', group: 'Alt Giyim' },
  { id: 'jogger', label: 'Eşofman / Jogger', group: 'Alt Giyim' },
  { id: 'socks', label: 'Performans Çorap', group: 'Aksesuar & Ekipman' },
  { id: 'hat', label: 'Şapka & Kep', group: 'Aksesuar & Ekipman' },
  { id: 'equipment', label: 'Termos & Matara', group: 'Aksesuar & Ekipman' },
]

const EVENT_BRANCHES = [
  'KOŞU', 
  'BİSİKLET', 
  'YOGA & MOBILITY', 
  'TENİS', 
  'VOLEYBOL', 
  'YELKEN', 
  'YÜZME', 
  'FONKSİYONEL ANTRENMAN', 
  'PİLATES', 
  'FITNESS',
  'YÜRÜYÜŞ',
  'KAMP & DOĞA'
]

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adminProfile, setAdminProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [registrations, setRegistrations] = useState<any[]>([])
  const [answerInputs, setAnswerInputs] = useState<{ [key: string]: string }>({})

  // Yeni Ürün Ekleme
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [price, setPrice] = useState('')
  const [comparePrice, setComparePrice] = useState('')
  const [category, setCategory] = useState('tshirt')
  const [categoryLabel, setCategoryLabel] = useState('T-Shirt')
  const [selectedColors, setSelectedColors] = useState<string[]>(['Siyah'])
  const [gender, setGender] = useState('erkek')
  
  const [colorSizesMap, setColorSizesMap] = useState<{ [color: string]: { [size: string]: number } }>({
    'Siyah': { XS: 0, S: 10, M: 20, L: 20, XL: 10, '2XL': 0, '3XL': 0, '4XL': 0 }
  })
  const [activeColorTab, setActiveColorTab] = useState<string>('Siyah')

  const [description, setDescription] = useState('')
  const [imageList, setImageList] = useState<string[]>([])

  // Yeni Etkinlik Ekleme
  const [evtTitle, setEvtTitle] = useState('')
  const [evtBranch, setEvtBranch] = useState('KOŞU')
  const [evtDate, setEvtDate] = useState('')
  const [evtLocation, setEvtLocation] = useState('')
  const [evtCapacity, setEvtCapacity] = useState('30')
  const [evtInstructor, setEvtInstructor] = useState('')
  const [evtDesc, setEvtDesc] = useState('')
  const [evtImageUrl, setEvtImageUrl] = useState('')
  const [eventUploading, setEventUploading] = useState(false)

  // Etkinlik Düzenleme Modal State'leri
  const [editingEvent, setEditingEvent] = useState<any | null>(null)
  const [editEvtTitle, setEditEvtTitle] = useState('')
  const [editEvtBranch, setEditEvtBranch] = useState('KOŞU')
  const [editEvtDate, setEditEvtDate] = useState('')
  const [editEvtLocation, setEditEvtLocation] = useState('')
  const [editEvtCapacity, setEditEvtCapacity] = useState('30')
  const [editEvtInstructor, setEditEvtInstructor] = useState('')
  const [editEvtDesc, setEditEvtDesc] = useState('')
  const [editEvtImageUrl, setEditEvtImageUrl] = useState('')
  const [editEventUploading, setEditEventUploading] = useState(false)

  // Ürün Düzenleme Modal
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editSubtitle, setEditSubtitle] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editComparePrice, setEditComparePrice] = useState('')
  const [editColors, setEditColors] = useState<string[]>([])
  const [editColorSizesMap, setEditColorSizesMap] = useState<{ [color: string]: { [size: string]: number } }>({})
  const [editActiveColorTab, setEditActiveColorTab] = useState<string>('')
  const [editCategory, setEditCategory] = useState('tshirt')
  const [editCategoryLabel, setEditCategoryLabel] = useState('T-Shirt')
  const [editGender, setEditGender] = useState('erkek')
  const [editDescription, setEditDescription] = useState('')
  const [editImages, setEditImages] = useState<string[]>([])

  const [trackingNoInput, setTrackingNoInput] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    checkAdminSession()
  }, [])

  const checkAdminSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      if (profile && ['admin', 'super_admin', 'store_admin'].includes(profile.role)) {
        setIsLoggedIn(true)
        setAdminProfile(profile)
        fetchData()
      }
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (prodData) setProducts(prodData)

      const { data: ordData } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      if (ordData) {
        setOrders(ordData)
        const initialTracking: { [key: string]: string } = {}
        ordData.forEach(o => { if (o.tracking_number) initialTracking[o.id] = o.tracking_number })
        setTrackingNoInput(initialTracking)
      }

      const { data: qData } = await supabase.from('product_questions').select('*').order('created_at', { ascending: false })
      if (qData) setQuestions(qData)

      const { data: evtData } = await supabase.from('events').select('*').order('date', { ascending: true })
      if (evtData) setEvents(evtData)

      const { data: regData } = await supabase.from('event_registrations').select('*, events(title)').order('created_at', { ascending: false })
      if (regData) setRegistrations(regData)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm('Bu soruyu silmek istediğinize emin misiniz?')) return
    const { error } = await supabase.from('product_questions').delete().eq('id', qId)
    if (!error) {
      alert('Soru silindi.')
      fetchData()
    }
  }

  const handleClearAllOrders = async () => {
    if (!confirm('DİKKAT: Tüm test siparişleri kalıcı olarak silinecektir. Emin misiniz?')) return
    const { error } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (!error) {
      alert('Tüm sipariş geçmişi temizlendi!')
      fetchData()
    } else {
      alert('Hata: ' + error.message)
    }
  }

  const toggleColorSelection = (colorName: string, isEdit: boolean = false) => {
    if (isEdit) {
      let updatedColors = [...editColors]
      if (updatedColors.includes(colorName)) {
        updatedColors = updatedColors.filter(c => c !== colorName)
      } else {
        updatedColors.push(colorName)
      }
      setEditColors(updatedColors)
      if (!updatedColors.includes(editActiveColorTab) && updatedColors.length > 0) {
        setEditActiveColorTab(updatedColors[0])
      }
      const newMap = { ...editColorSizesMap }
      if (!newMap[colorName]) {
        newMap[colorName] = { XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0, '4XL': 0 }
      }
      setEditColorSizesMap(newMap)
    } else {
      let updatedColors = [...selectedColors]
      if (updatedColors.includes(colorName)) {
        updatedColors = updatedColors.filter(c => c !== colorName)
      } else {
        updatedColors.push(colorName)
      }
      setSelectedColors(updatedColors)
      if (!updatedColors.includes(activeColorTab) && updatedColors.length > 0) {
        setActiveColorTab(updatedColors[0])
      }
      const newMap = { ...colorSizesMap }
      if (!newMap[colorName]) {
        newMap[colorName] = { XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0, '4XL': 0 }
      }
      setColorSizesMap(newMap)
    }
  }

  const handleSizeChange = (sizeKey: string, value: string, isEdit: boolean = false) => {
    const val = Number(value) || 0
    if (isEdit) {
      setEditColorSizesMap(prev => ({
        ...prev,
        [editActiveColorTab]: {
          ...(prev[editActiveColorTab] || {}),
          [sizeKey]: val
        }
      }))
    } else {
      setColorSizesMap(prev => ({
        ...prev,
        [activeColorTab]: {
          ...(prev[activeColorTab] || {}),
          [sizeKey]: val
        }
      }))
    }
  }

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'edit') => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    const uploadedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${i}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)
      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
        if (data?.publicUrl) uploadedUrls.push(data.publicUrl)
      }
    }

    if (target === 'new') setImageList((prev) => [...prev, ...uploadedUrls])
    else setEditImages((prev) => [...prev, ...uploadedUrls])
    setUploading(false)
  }

  const handleEventImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'edit') => {
    const file = e.target.files?.[0]
    if (!file) return
    if (target === 'new') setEventUploading(true)
    else setEditEventUploading(true)

    const fileExt = file.name.split('.').pop()
    const fileName = `event-${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)
    if (!uploadError) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
      if (data?.publicUrl) {
        if (target === 'new') setEvtImageUrl(data.publicUrl)
        else setEditEvtImageUrl(data.publicUrl)
      }
    }
    if (target === 'new') setEventUploading(false)
    else setEditEventUploading(false)
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !price) return

    let totalStock = 0
    Object.values(colorSizesMap).forEach(sizesObj => {
      totalStock += Object.values(sizesObj).reduce((a: any, b: any) => a + b, 0)
    })

    const { error } = await supabase.from('products').insert([{
      title,
      subtitle: subtitle || 'Özel Parça',
      price: Number(price),
      compare_at_price: comparePrice ? Number(comparePrice) : null,
      stock: totalStock,
      sizes: colorSizesMap,
      colors: selectedColors,
      gender: gender,
      category: category,
      category_label: categoryLabel,
      is_active: true,
      description: description || 'Kaliteli tekstil.',
      image_urls: imageList.length > 0 ? imageList : ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop']
    }])

    if (!error) {
      alert('Ürün başarıyla eklendi!')
      setTitle(''); setSubtitle(''); setPrice(''); setComparePrice(''); setDescription(''); setImageList([])
      fetchData()
    } else {
      alert('Hata: ' + error.message)
    }
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!evtTitle || !evtDate) return

    const { error } = await supabase.from('events').insert([{
      title: evtTitle,
      branch: evtBranch,
      date: evtDate,
      location: evtLocation || 'İstanbul',
      capacity: Number(evtCapacity) || 30,
      instructor_name: evtInstructor || null,
      description: evtDesc || 'Kulüp buluşması.',
      image_url: evtImageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop'
    }])

    if (!error) {
      alert('Etkinlik başarıyla eklendi!')
      setEvtTitle(''); setEvtDate(''); setEvtLocation(''); setEvtCapacity('30'); setEvtInstructor(''); setEvtDesc(''); setEvtImageUrl('')
      fetchData()
    } else {
      alert('Hata: ' + error.message)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Bu etkinliği silmek istediğinize emin misiniz?')) return
    await supabase.from('events').delete().eq('id', id)
    fetchData()
  }

  const openEditEventModal = (evt: any) => {
    setEditingEvent(evt)
    setEditEvtTitle(evt.title || '')
    setEditEvtBranch(evt.branch || 'KOŞU')
    if (evt.date) {
      const d = new Date(evt.date)
      const isoLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      setEditEvtDate(isoLocal)
    } else {
      setEditEvtDate('')
    }
    setEditEvtLocation(evt.location || '')
    setEditEvtCapacity(String(evt.capacity || 30))
    setEditEvtInstructor(evt.instructor_name || '')
    setEditEvtDesc(evt.description || '')
    setEditEvtImageUrl(evt.image_url || '')
  }

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEvent) return

    const { error } = await supabase.from('events').update({
      title: editEvtTitle,
      branch: editEvtBranch,
      date: editEvtDate,
      location: editEvtLocation,
      capacity: Number(editEvtCapacity) || 30,
      instructor_name: editEvtInstructor || null,
      description: editEvtDesc,
      image_url: editEvtImageUrl
    }).eq('id', editingEvent.id)

    if (!error) {
      alert('Etkinlik başarıyla güncellendi!')
      setEditingEvent(null)
      fetchData()
    } else {
      alert('Hata: ' + error.message)
    }
  }

  const handleUpdateRegistrationStatus = async (regId: string, status: string) => {
    const { error } = await supabase.from('event_registrations').update({ status }).eq('id', regId)
    if (!error) {
      alert('Katılımcı durumu güncellendi!')
      fetchData()
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const openEditModal = (prod: any) => {
    setEditingProduct(prod)
    setEditTitle(prod.title || '')
    setEditSubtitle(prod.subtitle || '')
    setEditPrice(prod.price || '')
    setEditComparePrice(prod.compare_at_price || '')
    
    const colors = prod.colors || ['Siyah']
    setEditColors(colors)
    setEditActiveColorTab(colors[0] || 'Siyah')

    let sizesStructure = prod.sizes || {}
    if (sizesStructure && typeof sizesStructure === 'object' && !sizesStructure[colors[0]]) {
      const converted: any = {}
      colors.forEach((c: string) => { converted[c] = sizesStructure })
      sizesStructure = converted
    }
    setEditColorSizesMap(sizesStructure)

    setEditCategory(prod.category || 'tshirt')
    setEditCategoryLabel(prod.category_label || 'T-Shirt')
    setEditGender(prod.gender || 'erkek')
    setEditDescription(prod.description || '')
    setEditImages(prod.image_urls || (prod.image_url ? [prod.image_url] : []))
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    let totalStock = 0
    Object.values(editColorSizesMap).forEach(sizesObj => {
      if (sizesObj) {
        totalStock += Object.values(sizesObj).reduce((a: any, b: any) => a + Number(b || 0), 0)
      }
    })

    const { error } = await supabase.from('products').update({
      title: editTitle,
      subtitle: editSubtitle,
      price: Number(editPrice),
      compare_at_price: editComparePrice ? Number(editComparePrice) : null,
      stock: totalStock,
      sizes: editColorSizesMap,
      colors: editColors,
      category: editCategory,
      category_label: editCategoryLabel,
      gender: editGender,
      description: editDescription,
      image_urls: editImages
    }).eq('id', editingProduct.id)

    if (!error) {
      alert('Ürün ve kategori başarıyla güncellendi!')
      setEditingProduct(null)
      fetchData()
    } else {
      alert('Hata: ' + error.message)
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string, currentStatus: string) => {
    if (currentStatus === 'İptal Edildi' || currentStatus === 'İade Edildi') {
      alert('İptal edilmiş veya iade edilmiş siparişlerin statüsü değiştirilemez!')
      return
    }

    const trackingNo = trackingNoInput[orderId] || null
    const { error } = await supabase.from('orders').update({
      status: newStatus,
      tracking_number: trackingNo
    }).eq('id', orderId)

    if (!error) {
      alert('Sipariş statüsü güncellendi!')
      fetchData()
    }
  }

  const handleCancelOrRefundOrder = async (orderId: string, actionType: 'cancel' | 'refund') => {
    const statusText = actionType === 'cancel' ? 'İptal Edildi' : 'İade Edildi'
    if (!confirm(`Bu siparişi "${statusText}" olarak işaretlemek istiyor musunuz?`)) return

    const { error } = await supabase.from('orders').update({
      status: statusText,
      cancelled_at: new Date().toISOString()
    }).eq('id', orderId)

    if (!error) {
      alert(`Sipariş başarıyla ${statusText.toLowerCase()}!`)
      fetchData()
    }
  }

  const handleAnswerQuestion = async (qId: string) => {
    const ans = answerInputs[qId]
    if (!ans?.trim()) return

    if (containsBadWord(ans)) {
      alert('Yanıtınızda uygunsuz kelimeler tespit edildi.')
      return
    }

    const { error } = await supabase.from('product_questions').update({ answer: ans }).eq('id', qId)
    if (!error) {
      alert('Soru yanıtlandı!')
      fetchData()
    }
  }

  const role = adminProfile?.role
  const isSuperAdmin = role === 'super_admin' || role === 'admin'
  const isStoreAdmin = role === 'store_admin'

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-8 shadow-2xl space-y-6 text-center">
          <Lock className="mx-auto h-8 w-8 text-primary" />
          <h1 className="text-xl font-black text-white">Yönetici Girişi Gerekli</h1>
          <Link href="/" className="inline-block w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase text-black">Ana Sayfaya Dön</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black text-white p-6 sm:p-10 font-sans">
      <div className="mx-auto max-w-7xl flex items-center justify-between border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-xl font-black text-white">ORISE Kontrol Paneli</h1>
          <p className="text-xs font-mono text-primary uppercase">Rol: {role}</p>
        </div>
        <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 cursor-pointer"><LogOut className="h-3.5 w-3.5" /> Çıkış</button>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 mb-16">
        
        {/* MÜŞTERİ SORU & CEVAP */}
        {(isSuperAdmin || isStoreAdmin) && (
          <div className="space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2 text-primary"><HelpCircle className="h-5 w-5" /><span>Müşteri Ürün Soruları</span></h2>
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 space-y-4">
              {questions.length === 0 ? (
                <p className="text-xs text-zinc-500 font-mono">Bekleyen soru bulunmuyor.</p>
              ) : (
                questions.map((q) => (
                  <div key={q.id} className="p-4 rounded-2xl border border-white/10 bg-black/60 space-y-3 text-xs">
                    <div className="flex justify-between items-center font-mono text-[10px] text-zinc-400">
                      <span>Müşteri: <strong className="text-white">{q.user_name}</strong></span>
                      <div className="flex items-center gap-3">
                        <span>{new Date(q.created_at).toLocaleString('tr-TR')}</span>
                        <button type="button" onClick={() => handleDeleteQuestion(q.id)} className="text-red-400 hover:text-red-300 font-bold cursor-pointer" title="Soruyu Sil">sil</button>
                      </div>
                    </div>
                    <p className="font-bold text-white">Soru: {q.question}</p>
                    
                    {q.answer ? (
                      <div className="text-primary bg-primary/10 p-3 rounded-xl border border-primary/20">
                        <strong>Yanıtınız:</strong> {q.answer}
                      </div>
                    ) : (
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Yanıtınızı yazın..."
                          value={answerInputs[q.id] || ''}
                          onChange={(e) => setAnswerInputs({ ...answerInputs, [q.id]: e.target.value })}
                          className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <button type="button" onClick={() => handleAnswerQuestion(q.id)} className="px-4 py-2 bg-primary text-black font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer">
                          <Send size={14} /> Yanıtla
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ETKİNLİK YÖNETİMİ & KONTENJAN */}
        {(isSuperAdmin || isStoreAdmin) && (
          <div className="space-y-12 border-t border-white/10 pt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold flex items-center gap-2 text-primary"><Calendar className="h-5 w-5" /><span>Topluluk & Etkinlik Yönetimi (Kontenjan Destekli)</span></h2>
            </div>

            {/* Yeni Etkinlik Ekleme Formu */}
            <div className="rounded-3xl border border-primary/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
              <h3 className="text-sm font-bold flex items-center gap-2 text-primary"><PlusCircle className="h-4 w-4" /><span>Yeni Etkinlik Oluştur</span></h3>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <input type="text" placeholder="Etkinlik Başlığı" required value={evtTitle} onChange={(e) => setEvtTitle(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                  <select value={evtBranch} onChange={(e) => setEvtBranch(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white">
                    {EVENT_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <input type="datetime-local" required value={evtDate} onChange={(e) => setEvtDate(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white font-mono" />
                  <input type="number" placeholder="Kontenjan (Kişi Sınırı)" required value={evtCapacity} onChange={(e) => setEvtCapacity(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white font-mono" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="text" placeholder="Konum" value={evtLocation} onChange={(e) => setEvtLocation(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                  <input type="text" placeholder="Eğitmen / Lider" value={evtInstructor} onChange={(e) => setEvtInstructor(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                  <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3 cursor-pointer">
                    <span className="text-xs text-zinc-400 truncate">{eventUploading ? 'Yükleniyor...' : evtImageUrl ? '✓ Afiş Seçildi' : 'Etkinlik Afişi Seç'}</span>
                    <Upload className="h-4 w-4 text-primary" />
                    <input type="file" accept="image/*" onChange={(e) => handleEventImageUpload(e, 'new')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </div>
                </div>

                <textarea rows={2} placeholder="Etkinlik Açıklaması..." value={evtDesc} onChange={(e) => setEvtDesc(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white resize-none" />
                <button type="submit" className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black cursor-pointer">Etkinliği Yayınla</button>
              </form>
            </div>

            {/* Etkinlik Listesi ve Katılımcılar */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /><span>Aktif Etkinlikler ve Kontenjan Durumları ({events.length})</span></h3>
              
              <div className="grid grid-cols-1 gap-6">
                {events.map((evt) => {
                  const evtRegs = registrations.filter((r: any) => r.event_id === evt.id)
                  const approvedCount = evtRegs.filter((r: any) => r.status === 'approved').length

                  return (
                    <div key={evt.id} className="rounded-3xl border border-white/10 bg-zinc-950 p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-primary font-bold">{evt.branch} · {new Date(evt.date).toLocaleString('tr-TR')}</span>
                          <h4 className="font-bold text-sm text-white">{evt.title}</h4>
                          <span className="text-[11px] text-zinc-400">📍 {evt.location} | 👥 Kontenjan: <strong className="text-primary">{approvedCount} / {evt.capacity || 30}</strong> Onaylı</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => openEditEventModal(evt)} className="px-3.5 py-1.5 bg-primary/20 text-primary border border-primary/40 rounded-xl text-xs font-bold hover:bg-primary/30 cursor-pointer inline-flex items-center gap-1.5"><Edit3 size={13} /> Düzenle</button>
                          <button type="button" onClick={() => handleDeleteEvent(evt.id)} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/20 cursor-pointer">Etkinliği Sil</button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Katılım Talepleri ({evtRegs.length}):</span>
                        {evtRegs.length === 0 ? (
                          <p className="text-xs text-zinc-500 italic">Henüz başvuran katılımcı yok.</p>
                        ) : (
                          <div className="divide-y divide-white/5 overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono">
                              <thead>
                                <tr className="text-zinc-500 text-[10px]">
                                  <th className="py-2">Ad Soyad</th>
                                  <th className="py-2">İletişim</th>
                                  <th className="py-2">Durum</th>
                                  <th className="py-2 text-right">İşlem</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 text-zinc-300">
                                {evtRegs.map((reg: any) => (
                                  <tr key={reg.id}>
                                    <td className="py-3 font-bold text-white">{reg.full_name}</td>
                                    <td className="py-3">{reg.email} <br/><span className="text-[10px] text-zinc-500">{reg.phone}</span></td>
                                    <td className="py-3">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        reg.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary/20 text-primary'
                                      }`}>
                                        {reg.status === 'approved' ? 'Onaylandı' : 'Talep Edildi'}
                                      </span>
                                    </td>
                                    <td className="py-3 text-right space-x-2">
                                      {reg.status !== 'approved' && (
                                        <button onClick={() => handleUpdateRegistrationStatus(reg.id, 'approved')} className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold cursor-pointer">Onayla</button>
                                      )}
                                      <button onClick={() => handleUpdateRegistrationStatus(reg.id, 'rejected')} className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg text-[10px] font-bold cursor-pointer">Reddet</button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* MAĞAZA SİPARİŞLERİ & İPTAL / İADE */}
        {(isSuperAdmin || isStoreAdmin) && (
          <div className="space-y-12 border-t border-white/10 pt-12">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-primary" /><span>Mağaza Siparişleri & İptal / İade Yönetimi ({orders.length})</span></h2>
                {orders.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllOrders}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 cursor-pointer"
                  >
                    <AlertTriangle size={13} /> Tüm Sipariş Geçmişini Temizle
                  </button>
                )}
              </div>

              <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="border-b border-white/10 bg-black/60 text-zinc-500 uppercase">
                      <tr>
                        <th className="p-4">Sipariş Tarih & Müşteri</th>
                        <th className="p-4">Ürünler</th>
                        <th className="p-4">Adres</th>
                        <th className="p-4">Kargo & İptal / İade İşlemleri</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                      {orders.length === 0 ? (
                        <tr><td colSpan={4} className="p-6 text-center text-zinc-500">Sipariş bulunmuyor.</td></tr>
                      ) : (
                        orders.map((ord) => {
                          const isLocked = ord.status === 'İptal Edildi' || ord.status === 'İade Edildi'

                          return (
                            <tr key={ord.id} className="hover:bg-zinc-900/40 align-top">
                              <td className="p-4 font-bold text-white space-y-1">
                                <div className="text-[10px] text-primary">{new Date(ord.created_at).toLocaleString('tr-TR')}</div>
                                <div>{ord.customer_name}</div>
                                <div className="text-[10px] text-zinc-400 font-normal">{ord.phone}</div>
                              </td>
                              <td className="p-4">
                                {ord.items?.map((i: any, idx: number) => (
                                  <div key={idx}>• {i.name} (x{i.quantity})</div>
                                ))}
                                <div className="text-primary font-bold mt-1">Toplam: ₺{ord.total_price}</div>
                              </td>
                              <td className="p-4 text-[11px]">
                                <div>{ord.address}</div>
                              </td>
                              <td className="p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Kargo Takip No"
                                    value={trackingNoInput[ord.id] || ''}
                                    onChange={(e) => setTrackingNoInput({ ...trackingNoInput, [ord.id]: e.target.value })}
                                    className="bg-black border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white w-36"
                                  />
                                  <select
                                    id={`status-${ord.id}`}
                                    defaultValue={ord.status}
                                    disabled={isLocked}
                                    className={`bg-black border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    <option value="Ödeme Bekliyor">Ödeme Bekliyor</option>
                                    <option value="Ödeme Onaylandı">Ödeme Onaylandı</option>
                                    <option value="Kargolandı">Kargolandı</option>
                                    <option value="Teslim Edildi">Teslim Edildi</option>
                                    <option value="İade Talep Edildi">İade Talep Edildi</option>
                                    <option value="İade Edildi">İade Edildi</option>
                                    <option value="İptal Edildi">İptal Edildi</option>
                                  </select>
                                  {!isLocked && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const sel = (document.getElementById(`status-${ord.id}`) as HTMLSelectElement).value
                                        handleUpdateOrderStatus(ord.id, sel, ord.status)
                                      }}
                                      className="px-3 py-1.5 bg-primary text-black rounded-lg text-[11px] font-bold cursor-pointer"
                                    >
                                      Kaydet
                                    </button>
                                  )}
                                </div>

                                <div className="flex gap-2 pt-1">
                                  {!isLocked && (
                                    <button
                                      type="button"
                                      onClick={() => handleCancelOrRefundOrder(ord.id, 'cancel')}
                                      className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-[10px] font-bold hover:bg-red-500/20 cursor-pointer inline-flex items-center gap-1"
                                    >
                                      <Ban size={12} /> Siparişi İptal Et
                                    </button>
                                  )}
                                  {ord.status === 'İade Talep Edildi' && (
                                    <button
                                      type="button"
                                      onClick={() => handleCancelOrRefundOrder(ord.id, 'refund')}
                                      className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold hover:bg-emerald-500/20 cursor-pointer inline-flex items-center gap-1"
                                    >
                                      <CheckCircle2 size={12} /> İadeyi Onayla & Parayı İade Et
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* YENİ ÜRÜN EKLEME */}
            <div className="rounded-3xl border border-primary/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
              <h2 className="text-base font-bold flex items-center gap-2 text-primary"><PlusCircle className="h-5 w-5" /><span>Mağazaya Ürün Ekle (Genişletilmiş Kategoriler)</span></h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <input type="text" placeholder="Ürün Başlığı" required value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                  <input type="number" placeholder="Güncel Fiyat (₺)" required value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                  <input type="number" placeholder="Eski Fiyat" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white">
                    <option value="erkek">Erkek Koleksiyonu</option>
                    <option value="kadin">Kadın Koleksiyonu</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select value={category} onChange={(e) => {
                    const val = e.target.value
                    setCategory(val)
                    const match = CATEGORY_OPTIONS.find(c => c.id === val)
                    if (match) setCategoryLabel(match.label)
                  }} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id}>[{cat.group}] {cat.label}</option>
                    ))}
                  </select>

                  <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3 cursor-pointer">
                    <span className="text-xs text-zinc-400 truncate">{uploading ? 'Yükleniyor...' : imageList.length > 0 ? `✓ ${imageList.length} Fotoğraf` : 'Fotoğraf Seç'}</span>
                    <Upload className="h-4 w-4 text-primary" />
                    <input type="file" accept="image/*" multiple onChange={(e) => handleMultipleImageUpload(e, 'new')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block">Ürün Renk Seçenekleri</label>
                  <div className="flex flex-wrap gap-3">
                    {PRESET_COLORS.map((col) => {
                      const isSelected = selectedColors.includes(col.name)
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => {
                            toggleColorSelection(col.name, false)
                            if (!selectedColors.includes(col.name)) setActiveColorTab(col.name)
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold cursor-pointer transition-all ${
                            isSelected ? 'border-primary bg-primary/20 text-white' : 'border-white/10 bg-black text-zinc-400'
                          }`}
                        >
                          <span className="h-3.5 w-3.5 rounded-full border border-white/30" style={{ backgroundColor: col.hex }} />
                          {col.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {selectedColors.length > 0 && (
                  <div className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">Stok Girdiğiniz Renk:</span>
                      <div className="flex gap-2">
                        {selectedColors.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setActiveColorTab(c)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                              activeColorTab === c ? 'bg-primary text-black' : 'bg-zinc-900 text-zinc-300'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-primary">[{activeColorTab}] Rengi İçin Beden Stokları</label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'].map((sz) => (
                          <div key={sz}>
                            <span className="text-[9px] text-zinc-500">{sz}</span>
                            <input
                              type="number"
                              value={colorSizesMap[activeColorTab]?.[sz] ?? 0}
                              onChange={(e) => handleSizeChange(sz, e.target.value, false)}
                              className="w-full rounded-xl border border-white/10 bg-black px-2 py-2 text-xs text-white text-center"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {imageList.length > 0 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {imageList.map((imgUrl, imgIdx) => (
                      <div key={imgIdx} className="relative h-16 w-16 rounded-xl overflow-hidden border border-white/20 flex-none group">
                        <Image src={imgUrl} alt="" fill className="object-cover" />
                        <button type="button" onClick={() => setImageList(imageList.filter((_, i) => i !== imgIdx))} className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold cursor-pointer">Kaldır</button>
                      </div>
                    ))}
                  </div>
                )}

                <textarea rows={3} placeholder="Ürün Açıklaması (HTML destekler)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white resize-none" />
                <button type="submit" className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black cursor-pointer">Ürünü Yayınla</button>
              </form>
            </div>

            {/* YÜKLÜ ÜRÜNLER */}
            <div className="space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /><span>Yüklü Ürünler ({products.length})</span></h2>
              <div className="space-y-3">
                {products.map((prod) => (
                  <div key={prod.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950 p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-black border border-white/10 flex-none">
                        <Image src={prod.image_urls?.[0] || prod.image_url || '/placeholder.svg'} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white">{prod.title}</h4>
                        <div className="text-[10px] text-zinc-400 font-mono">₺{prod.price} | Kategori: {prod.category_label || prod.category}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEditModal(prod)} className="p-2.5 bg-zinc-800 rounded-xl text-zinc-200 hover:text-white cursor-pointer" title="Düzenle"><Edit3 size={14} /></button>
                      <button type="button" onClick={() => handleDeleteProduct(prod.id)} className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 cursor-pointer" title="Sil"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ETKİNLİK DÜZENLEME MODALI */}
      {editingEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md" onClick={() => setEditingEvent(null)}>
          <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-bold text-base text-white">Etkinliği Düzenle</h3>
              <button type="button" onClick={() => setEditingEvent(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleUpdateEvent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" required value={editEvtTitle} onChange={(e) => setEditEvtTitle(e.target.value)} placeholder="Etkinlik Başlığı" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                <select value={editEvtBranch} onChange={(e) => setEditEvtBranch(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white">
                  {EVENT_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input type="datetime-local" required value={editEvtDate} onChange={(e) => setEditEvtDate(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white font-mono" />
                <input type="text" value={editEvtLocation} onChange={(e) => setEditEvtLocation(e.target.value)} placeholder="Konum" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                <input type="number" required value={editEvtCapacity} onChange={(e) => setEditEvtCapacity(e.target.value)} placeholder="Kontenjan" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white font-mono" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" value={editEvtInstructor} onChange={(e) => setEditEvtInstructor(e.target.value)} placeholder="Eğitmen / Lider" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3 cursor-pointer">
                  <span className="text-xs text-zinc-400 truncate">{editEventUploading ? 'Yükleniyor...' : editEvtImageUrl ? '✓ Afiş Güncellendi' : 'Yeni Afiş Seç'}</span>
                  <Upload className="h-4 w-4 text-primary" />
                  <input type="file" accept="image/*" onChange={(e) => handleEventImageUpload(e, 'edit')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </div>
              </div>

              <textarea rows={3} value={editEvtDesc} onChange={(e) => setEditEvtDesc(e.target.value)} placeholder="Etkinlik Açıklaması (HTML destekler)" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white resize-none" />
              <button type="submit" className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase text-black cursor-pointer shadow-lg">Etkinliği Güncelle</button>
            </form>
          </div>
        </div>
      )}

      {/* ÜRÜN DÜZENLEME MODALI */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md" onClick={() => setEditingProduct(null)}>
          <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-bold text-base text-white">Ürünü, Kategoriyi ve Matrisi Düzenle</h3>
              <button type="button" onClick={() => setEditingProduct(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <input type="text" required value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input type="number" required value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="Fiyat" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                <select value={editCategory} onChange={(e) => {
                  const val = e.target.value
                  setEditCategory(val)
                  const match = CATEGORY_OPTIONS.find(c => c.id === val)
                  if (match) setEditCategoryLabel(match.label)
                }} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.id} value={cat.id}>[{cat.group}] {cat.label}</option>
                  ))}
                </select>
                <select value={editGender} onChange={(e) => setEditGender(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white">
                  <option value="erkek">Erkek</option>
                  <option value="kadin">Kadın</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block">Renkler</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((col) => {
                    const isSelected = editColors.includes(col.name)
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => {
                          toggleColorSelection(col.name, true)
                          if (!editColors.includes(col.name)) setEditActiveColorTab(col.name)
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold cursor-pointer ${
                          isSelected ? 'border-primary bg-primary/20 text-white' : 'border-white/10 bg-black text-zinc-400'
                        }`}
                      >
                        <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: col.hex }} />
                        {col.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {editColors.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">Stok Düzenlenen Renk:</span>
                    <div className="flex gap-2">
                      {editColors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setEditActiveColorTab(c)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                            editActiveColorTab === c ? 'bg-primary text-black' : 'bg-zinc-900 text-zinc-300'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-primary">[{editActiveColorTab}] Rengi İçin Beden Stokları</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'].map((sz) => (
                        <div key={sz}>
                          <span className="text-[9px] text-zinc-500">{sz}</span>
                          <input
                            type="number"
                            value={editColorSizesMap[editActiveColorTab]?.[sz] ?? 0}
                            onChange={(e) => handleSizeChange(sz, e.target.value, true)}
                            className="w-full rounded-xl border border-white/10 bg-black px-2 py-2 text-xs text-white text-center"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <textarea rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white resize-none" />
              <button type="submit" className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase text-black cursor-pointer shadow-lg">Değişiklikleri Kaydet</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
