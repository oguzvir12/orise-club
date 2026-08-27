import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export default function MesafeliSatisPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 sm:p-12 pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
          <span>Ana Sayfaya Dön</span>
        </Link>

        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <FileText className="h-3.5 w-3.5" /> Yasal Sözleşme
          </div>
          <h1 className="text-3xl font-black">Mesafeli Satış Sözleşmesi</h1>
          <p className="text-xs text-zinc-400 font-mono">6502 Sayılı Tüketicinin Korunması Hakkında Kanun Gereğince Düzenlenmiştir.</p>
        </div>

        <div className="space-y-6 text-xs text-zinc-300 leading-relaxed font-sans">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Madde 1 - Konu</h2>
            <p>
              İşbu sözleşmenin konusu, Alıcı&apos;nın Satıcı&apos;ya ait internet sitesinden elektronik ortamda siparişini yaptığı, nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Madde 2 - Teslimat ve Masraflar</h2>
            <p>
              Ürün sevkiyat masrafı olan kargo ücreti aksi belirtilmedikçe Alıcı tarafından ödenir. Satın alınan ürün, yasal 30 günlük süreyi aşmamak kaydıyla Alıcı&apos;nın belirttiği teslimat adresindeki kişi veya kuruluşa teslim edilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Madde 3 - Cayma Hakkı</h2>
            <p>
              Alıcı, mal satışına ilişkin sözleşmelerde, ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren 14 (on dört) gün içerisinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin sözleşmeden cayma hakkını kullanabilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Madde 4 - Yetkili Mahkeme</h2>
            <p>
              İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı tarafından ilan edilen değere kadar Tüketici Hakem Heyetleri ile Alıcı&apos;nın veya Satıcı&apos;nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
