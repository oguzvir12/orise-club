'use client'

import { useState } from 'react'
import { X, Mail, Lock, User, Phone, MapPin, Check, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isLogin && !termsAccepted) {
      setError('Lütfen KVKK ve mesafeli satış şartlarını onaylayınız.')
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        // Giriş Yap
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        setSuccessMsg(true)
        setTimeout(() => {
          setSuccessMsg(false)
          onSuccess()
          onClose()
        }, 1500)
      } else {
        // Kayıt Ol
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
        
        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            throw new Error('Bu e-posta zaten sistemde kayıtlı! Lütfen "Giriş Yap" seçeneğini kullanın.')
          }
          throw signUpError
        }

        if (data.user) {
          // Profil tablosuna ek bilgilerini kaydedelim
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName,
            phone: phone,
            address: address,
          })
          if (profileError) throw profileError
        }

        setSuccessMsg(true)
        setTimeout(() => {
          setSuccessMsg(false)
          onSuccess()
          onClose()
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl text-white">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-black">{isLogin ? 'Kulüp Hesabına Giriş Yap' : 'Rise Community Üyesi Ol'}</h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isLogin ? 'Etkinliklere hızlıca kaydol ve bilgilerini yönet.' : 'Aramıza katıl, etkinliklerde zaman kazan.'}
          </p>
        </div>

        {successMsg ? (
          <div className="py-10 text-center space-y-4 animate-fadeIn">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Check className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-white">{isLogin ? 'Giriş Başarılı!' : 'Aramıza Hoş Geldin!'}</h3>
            <p className="text-xs text-zinc-400">İşlemin başarıyla tamamlandı, yönlendiriliyorsun...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Ad Soyad</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Adınız Soyadınız"
                      className="w-full rounded-xl border border-white/10 bg-black/60 pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Telefon Numarası</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05XXXXXXXXX"
                      className="w-full rounded-xl border border-white/10 bg-black/60 pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Teslimat / İkamet Adresi</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Mahalle, Cadde, No, İlçe/İl"
                      className="w-full rounded-xl border border-white/10 bg-black/60 pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">E-Posta Adresi</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@mail.com"
                  className="w-full rounded-xl border border-white/10 bg-black/60 pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-black/60 pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="termsCheck"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-black text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="termsCheck" className="text-[11px] leading-relaxed text-zinc-400">
                  <span className="text-zinc-300">KVKK Aydınlatma Metni</span> ve <span className="text-zinc-300">Mesafeli Satış Sözleşmesi</span> şartlarını okudum ve onaylıyorum.
                </label>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-50"
            >
              {loading ? 'İşleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol ve Tamamla'}
            </button>
          </form>
        )}

        {!successMsg && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-zinc-400 hover:text-white underline font-mono cursor-pointer"
            >
              {isLogin ? 'Hesabın yok mu? Hemen kayıt ol →' : 'Zaten hesabın var mı? Giriş yap →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
