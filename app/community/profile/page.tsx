'use client';
import { useState } from 'react';
import { User, Phone, AlertCircle, Award, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Topluluk Profilin</h1>
        <p className="text-zinc-400 text-sm mt-1">Mağaza hesabınla senkronize çalışır. Etkinlikler için iletişim bilgilerini tamamla.</p>
      </div>

      {saved && (
        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <ShieldCheck size={18} /> Profil bilgilerin başarıyla güncellendi!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Ad Soyad</label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-3 text-zinc-500" />
            <input 
              type="text" 
              defaultValue="Murat Örnek" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 pl-10 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Telefon Numarası (Etkinlik Bilgilendirmeleri İçin)</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3.5 top-3 text-zinc-500" />
            <input 
              type="tel" 
              placeholder="0532 XXX XX XX" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 pl-10 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Koşu / Antrenman Seviyesi</label>
          <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500">
            <option>Başlangıç Seviyesi (Tempo 6:30+)</option>
            <option>Orta Seviye (Tempo 5:30 - 6:15)</option>
            <option>İleri Düzey / Pacer Adayı (Tempo 5:00 ve altı)</option>
          </select>
        </div>

        <div className="pt-2">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500/10 p-2.5 rounded-lg text-orange-500">
                <Award size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Kulüp Üyelik Rozeti</h4>
                <p className="text-xs text-zinc-400">Kurucu Üye & Aktif Katılımcı</p>
              </div>
            </div>
            <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md font-medium">Aktif</span>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl text-sm transition-all"
        >
          Değişiklikleri Kaydet
        </button>
      </form>
    </div>
  );
}
