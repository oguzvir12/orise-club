import Link from 'next/link'
import { ArrowLeft, RotateCcw } from 'lucide-react'

export default function IadeKosullariPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 sm:p-12 pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
          <span>Ana Sayfaya Dön</span>
        </Link>

        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <RotateCcw className="h-3.5 w-3.5" /> Tüketici Hakları
          </div>
          <h1 className="text-3xl font-black">İptal ve İade Koşulları</h1>
          <p className="text-xs text-zinc-400 font-mono">Ürün İade ve Değişim Süreçleri Esasları</p>
        </div>

        <div className="space-y-6 text-xs text-zinc-300 leading-relaxed font-sans">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">1. Genel İade Şartları</h2>
            <p>
              Sitemiz üzerinden satın aldığınız ürünleri, teslim tarihinden itibaren **7 ila 14 gün** içerisinde iade talebi oluşturarak geri gönderebilirsiniz. 
              İade edilecek ürünün orijinal kutusu, ambalajı, varsa standart aksesuarları ve faturası ile birlikte eksiksiz ve hasarsız olması gerekmektedir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">2. İade Süreci Nasıl İşler?</h2>
            <p>
              Profil sayfanızdaki &quot;Siparişlerim&quot; bölümünden ilgili siparişiniz için iade talebi oluşturabilir, sebep belirterek süreci başlatabilirsiniz. 
              Tarafımıza ulaşan iade ürünler incelendikten sonra onay süreci tamamlanır ve ücret iadeniz kullandığınız ödeme yöntemine (kredi kartı / İyzico havuzu) 10-14 iş günü içerisinde aktarılır.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">3. Cayma Hakkı Kullanılamayacak Ürünler</h2>
            <p>
              Tüketicinin özel istekleri veya açıkça kişisel ihtiyaçları doğrultusunda hazırlanan, ambalajı açıldığı takdirde sağlık ve hijyen açısından iadesi uygun olmayan (İç giyim, mayo altları vb.) ürünlerde cayma hakkı ve iade işlemi gerçekleştirilememektedir.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
