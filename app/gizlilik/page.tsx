import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 sm:p-12 pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Ana Sayfaya Dön</span>
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <Shield className="h-3.5 w-3.5" /> Yasal Metin
          </div>
          <h1 className="text-3xl font-black">Gizlilik ve Güvenlik Politikası</h1>
          <p className="text-xs text-zinc-400 font-mono">Son Güncelleme: 2026</p>
        </div>

        <div className="space-y-6 text-xs text-zinc-300 leading-relaxed font-sans border-t border-white/10 pt-6">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">1. Kişisel Verilerin Toplanması</h2>
            <p>Mağazamız üzerinden gerçekleştirilen üyelik ve alışveriş süreçlerinde işin doğası gereği ad, soyad, telefon, e-posta adresi, TCKN ve teslimat adresiniz gibi kişisel bilgileriniz toplanmaktadır.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">2. Kredi Kartı ve Ödeme Güvenliği</h2>
            <p>Alışverişlerinizde kullanılan kredi kartı bilgileriniz hiçbir şekilde sistemimizde saklanmamaktadır. Ödemeleriniz 256-bit SSL güvenlik sertifikası güvencesiyle doğrudan ilgili banka ve İyzico altyapısı üzerinden şifrelenerek gerçekleştirilir.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">3. İstisnai Haller</h2>
            <p>Toplanan kişisel verileriniz yalnızca yasal zorunluluklar, üyelik sözleşmesi gerekleri ve yetkili adli/idari makamların talepleri doğrultusunda üçüncü şahıslarla paylaşılabilir.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
