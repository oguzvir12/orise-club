'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Flame, Image as ImageIcon, Send, Trash2, Lock, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { SiteHeader } from '@/components/site-header'
import AuthModal from '@/components/auth-modal'

export default function HubPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    checkUser()
    fetchPosts()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      setUser(session.user)
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      if (data) setProfile(data)
    }
  }

  const fetchPosts = async () => {
    const { data } = await supabase.from('hub_posts').select('*').order('created_at', { ascending: false })
    if (data) setPosts(data)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      setUploading(true)
      const fileName = `hub-${Date.now()}.${file.name.split('.').pop()}`

      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)
      if (uploadError) { alert('Yükleme hatası: ' + uploadError.message); return }

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
      if (data?.publicUrl) {
        setImageUrl(data.publicUrl)
        alert('Fotoğraf eklendi!')
      }
    } catch (err: any) {
      alert('Hata: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { setIsAuthModalOpen(true); return }
    if (!content.trim() && !imageUrl) return

    setLoading(true)
    try {
      const { error } = await supabase.from('hub_posts').insert([{
        user_id: user.id,
        author_name: profile?.full_name || user.email,
        content: content.trim(),
        image_url: imageUrl,
      }])

      if (error) throw error

      const currentXp = profile?.xp || 0
      await supabase.from('profiles').update({ xp: currentXp + 10 }).eq('id', user.id)

      setContent('')
      setImageUrl('')
      fetchPosts()
      checkUser()
      alert('Paylaşım yapıldı! +10 XP kazandın 🎉')
    } catch (err: any) {
      alert('Hata: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string, currentLikes: number) => {
    if (!user) { setIsAuthModalOpen(true); return }
    const { error } = await supabase.from('hub_posts').update({ likes_count: (currentLikes || 0) + 1 }).eq('id', postId)
    if (!error) fetchPosts()
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Bu gönderiyi silmek istiyor musunuz?')) return
    const { error } = await supabase.from('hub_posts').delete().eq('id', postId)
    if (!error) fetchPosts()
  }

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 pt-32 pb-24 space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="space-y-1">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white mb-2">
              <ArrowLeft className="h-3.5 w-3.5 text-primary" /> Ana Sayfa
            </Link>
            <h1 className="text-3xl font-black tracking-tight text-white">ORISE <span className="text-primary">HUB</span></h1>
            <p className="text-xs text-zinc-400">Kulüp üyelerinin antrenman notları, fotoğrafları ve anlık akışı.</p>
          </div>
        </div>

        {/* Üye Olmayanlar İçin Şık Uyarı Kartı */}
        {!user && (
          <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-8 text-center space-y-4 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/40">
              <Lock className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-white">ORISE Hub Paylaşım & Akış Alanı</h3>
              <p className="text-xs text-zinc-300 max-w-md mx-auto">
                Kulüp üyelerinin paylaşımlarını görmek, antrenman fotoğraflarını incelemek ve kendi maceralarını paylaşmak için hemen giriş yap veya üye ol!
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg cursor-pointer hover:scale-105 transition-transform"
              >
                <Sparkles className="h-4 w-4" /> Giriş Yap / Kayıt Ol
              </button>
            </div>
          </div>
        )}

        {user && (
          <form onSubmit={handleCreatePost} className="rounded-3xl border border-white/10 bg-zinc-950 p-6 space-y-4 shadow-xl">
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bugün nasıl koştun? Antrenman notunu veya maceranı paylaş..."
              className="w-full rounded-2xl border border-white/10 bg-black p-4 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none resize-none"
            />

            {imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
                <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                <button type="button" onClick={() => setImageUrl('')} className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/80 text-white flex items-center justify-center text-xs">✕</button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 hover:border-primary hover:text-white cursor-pointer transition-all">
                <ImageIcon className="h-4 w-4 text-primary" />
                <span>{uploading ? 'Yükleniyor' : 'Fotoğraf Ekle'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg cursor-pointer hover:scale-105 transition-transform disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" /> Paylaş
              </button>
            </div>
          </form>
        )}

        {/* Akış Alanı (Sadece üyeler görebilir veya üye değilse bulanıklaştırılır/kilitlenir) */}
        {user ? (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 text-xs font-mono">Henüz bir paylaşım yapılmadı. İlk sen ol!</div>
            ) : (
              posts.map((post) => {
                const isOwner = user?.id === post.user_id

                return (
                  <div key={post.id} className="rounded-3xl border border-white/10 bg-zinc-950 p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center text-xs font-bold">
                          {post.author_name?.[0]?.toUpperCase() || 'O'}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-white">{post.author_name}</h4>
                          <span className="text-[10px] font-mono text-zinc-500">{new Date(post.created_at).toLocaleDateString('tr-TR', { dateStyle: 'medium' })}</span>
                        </div>
                      </div>
                      {isOwner && (
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {post.content && <p className="text-xs leading-relaxed text-zinc-300">{post.content}</p>}

                    {post.image_url && (
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
                        <Image src={post.image_url} alt="Post image" fill className="object-cover" />
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleLike(post.id, post.likes_count)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-primary hover:text-primary transition-all cursor-pointer"
                      >
                        <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
                        <span>{post.likes_count || 0} Fire</span>
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        ) : (
          <div className="relative py-20 text-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10 flex flex-col items-center justify-center space-y-3">
              <Lock className="h-6 w-6 text-primary animate-pulse" />
              <p className="text-xs font-mono text-zinc-300">Paylaşım akışını görmek için giriş yapmalısınız.</p>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="rounded-full bg-white/10 border border-white/20 px-6 py-2 text-xs font-bold uppercase text-white hover:bg-primary hover:text-black transition-colors cursor-pointer"
              >
                Giriş Yap
              </button>
            </div>
            {/* Arka planda kilitli/bulanık örnek akış hissi */}
            <div className="opacity-20 filter blur-sm space-y-4 pointer-events-none">
              <div className="h-32 rounded-3xl bg-zinc-900 border border-white/10"></div>
              <div className="h-32 rounded-3xl bg-zinc-900 border border-white/10"></div>
            </div>
          </div>
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          checkUser()
          fetchPosts()
        }}
      />
    </div>
  )
}
