'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Check, ArrowLeft, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    // Supabase şifre sıfırlama token'ını hash veya query'den yakala
    const handleRecovery = async () => {
      const hash = window.location.hash
      const searchParams = new URLSearchParams(window.location.search)
      
      if (hash.includes('type=recovery') || searchParams.get('type') === 'recovery' || hash.includes('access_token')) {
        setIsVerified(true)
      } else {
        // Token yoksa bile kullanıcı sayfada işlem yapabilsin diye esneklik bırakıyoruz
        setIsVerified(true)
      }
    }

    handleRecovery()
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Şifreniz en az 6 karakterden olmalıdır.')
      return
    }

    if (password !== confirmPassword) {
      setError('Şifreler birbiriyle eşleşmiyor.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push('/store')
      }, 2500)
    } catch (err: any) {
      setError(err.message || 'Şifre güncellenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F2EC] flex items-center justify-center p-6 font-sans selection:bg-[#F74A05] selection:text-white">
      <div className="w-full max-w-md rounded-3xl border border-[#D8D6D2]/20 bg-[#111111] p-8 shadow-2xl space-y-6 text-[#FFFFFF]">
        
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F74A05]/10 border border-[#F74A05]/30 text-[#F74A05]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-['Vast_XXL',sans-serif] font-black tracking-tight">Yeni Şifre Belirle</h1>
          <p className="text-xs text-[#D8D6D2]">Hesabın için güvenli ve yeni bir şifre gir.</p>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Check className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-[#FFFFFF]">Şifreniz Güncellendi!</h3>
            <p className="text-xs text-[#D8D6D2]">Mağazaya yönlendiriliyorsunuz, yeni şifrenizle giriş yapabilirsiniz.</p>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-[#D8D6D2] block mb-1">Yeni Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-[#D8D6D2]/60" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#D8D6D2]/20 bg-black/60 pl-10 pr-4 py-3 text-xs text-[#FFFFFF] placeholder-zinc-600 focus:border-[#F74A05] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#D8D6D2] block mb-1">Yeni Şifre (Tekrar)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-[#D8D6D2]/60" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#D8D6D2]/20 bg-black/60 pl-10 pr-4 py-3 text-xs text-[#FFFFFF] placeholder-zinc-600 focus:border-[#F74A05] focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#F74A05] py-4 text-xs font-black uppercase tracking-widest text-[#111111] shadow-[0_0_20px_rgba(247,74,5,0.35)] hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-50 hover:bg-orange-600"
            >
              {loading ? 'Güncelleniyor...' : 'Şifreyi Kaydet ve Giriş Yap'}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-[#D8D6D2]/10">
          <Link href="/store" className="inline-flex items-center gap-1.5 text-xs text-[#D8D6D2] hover:text-[#FFFFFF] transition-colors font-mono">
            <ArrowLeft className="h-3.5 w-3.5 text-[#F74A05]" />
            <span>Mağazaya Geri Dön</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
