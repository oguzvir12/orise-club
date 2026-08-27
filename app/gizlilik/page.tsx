import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 sm:p-12 pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
          <span>Ana Sayfaya Dön</span>
        </Link>

        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <ShieldCheck className="h-3.5 w-3.5" /> Yasal Bilgilendirme
          </div>
          <h1 className="text-3xl font-black">Gizlilik ve Güvenlik Politikası</h1>
          <p className="text-xs text-zinc-400 font-mono">Son Güncelleme Tarihi: 2026</p>
        </div>

        <div className="space-y-6 text-xs text-zinc-300 leading-relaxed font-sans">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">1. Verilerin Toplanması ve Amacı</h2>
            <p>
              ORISE CLUB olarak, üyelerimizin kişisel verileri 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) başta olmak üzere ilgili mevzuata uygun olarak işlenmektedir. 
              Üyelik, sipariş formları ve iletişim kanalları aracılığıyla ad soyad, telefon, e-posta, TCKN ve teslimat adresiniz gibi kişisel verileriniz hizmet kalitesini artırmak ve yasal yükümlülükleri yerine getirmek amacıyla toplanır.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">2. Kredi Kartı ve Ödeme Güvenliği</h2>
            <p>
              Sitemiz üzerinden yapılan alışverişlerde kredi kartı bilgileriniz hiçbir şekilde sunucularımızda veya veri tabanlarımızda saklanmamaktadır. 
              Ödeme işlemleri, 256-bit SSL güvenlik sertifikası şifrelemesiyle doğrudan banka ve İyzico güvenli ödeme altyapısı üzerinden gerçekleştirilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">3. Bilgi Paylaşımı ve İstisnai Haller</h2>
            <p>
              Kullanıcılarımıza ait kişisel bilgiler, onayınız olmaksızın üçüncü şahıslarla paylaşılmaz. Ancak yetkili mahkeme, savcılık veya yasal otoriteler tarafından usulüne uygun olarak talep edilmesi halinde, yasal zorunluluk gereği ilgili kurumlarla paylaşılabilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">4. İletişim</h2>
            <p>
              Gizlilik politikamız ile ilgili her türlü soru, öneri ve talepleriniz için <span className="text-primary font-mono">community@oriseclub.com</span> e-posta adresi üzerinden bizimle iletişime geçebilirsiniz.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
