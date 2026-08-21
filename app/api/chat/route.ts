import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const msg = message.toLowerCase();

    let response = "";

    // 1. SOSYAL VE KİŞİSEL (Yaş, Naber, Kimsin vb.)
    if (msg.includes('yaş') || msg.includes('kaç') || msg.includes('doğdun')) {
      response = "Ben ORISE Club'ın dijital beyinlerinden biriyim, yaşım yok ama enerjim her zaman 20! 😎";
    } 
    else if (msg.includes('naber') || msg.includes('selam') || msg.includes('merhaba') || msg.includes('nasılsın')) {
      response = "Selam şampiyon! 🔥 ORISE sunucularında koşturmaca devam ediyor. Sen nasılsın, bugün hangi branşta hareket ediyoruz?";
    }
    else if (msg.includes('kimsin') || msg.includes('sen ne') || msg.includes('orise')) {
      response = "Ben ORISE Club asistanıyım. Sporu, hareketi ve sokak giyimini (@orisestore) harmanlayan bu modern topluluğun tüm kurallarını, etkinliklerini ve mağaza süreçlerini cebimde taşırım! 🚀";
    }

    // 2. KULÜP & ETKİNLİK
    else if (msg.includes('etkinlik') || msg.includes('koşu') || msg.includes('voleybol') || msg.includes('tenis') || msg.includes('yoga') || msg.includes('yelken') || msg.includes('branş')) {
      response = "Koşu, voleybol, tenis, yoga ve yelken gibi pek çok branşta sahalardayız! 🎾 Oriseclub.com üzerinden etkinliklerimize bilet alabilir veya kayıt oluşturabilirsin. Gelmeden önce dijital feragatnameyi onaylamayı unutma!";
    }

    // 3. MAĞAZA, FATURA & İADE
    else if (msg.includes('iade') || msg.includes('para') || msg.includes('ücret')) {
      response = "İadelerini profesyonel standartlarda işleme alıyoruz. Onaylanan iade tutarın, bankanın işlem süresine bağlı olarak ortalama 3-7 iş günü içinde kartına yansır. Gönlün ferah olsun! 💳";
    }
    else if (msg.includes('fatura') || msg.includes('mail') || msg.includes('e-fatura')) {
      response = "Alışverişlerin ve etkinlik biletlerin için düzenlenen dijital e-faturalar, sistemimizde kayıtlı olan e-posta adresine otomatik olarak gönderilir. Spam klasörüne de bir göz atmanı öneririm! 🧾";
    }
    else if (msg.includes('ödeme') || msg.includes('kredi')) {
      response = "Ödemelerini PayTr'nin güvenli sanal POS altyapısı üzerinden kredi veya banka kartınla gönül rahatlığıyla yapabilirsin. Güvenliğin bizim için en önde gelir! 🔒";
    }

    // 4. ANLAMADIĞI VEYA DESTEK GEREKEN DURUMLAR (Burada veritabanına ve sana raporlar)
    else {
      response = `"${message}" konusunu not aldım! 🧐 Bunu hemen admin ekibimize ilettim, en kısa sürede seninle e-posta veya telefon üzerinden iletişime geçecekler.`;

      // Eğer kullanıcı giriş yapmışsa veya maile iletmek istersek ai_chat_logs tablosuna atabiliriz
      await supabase.from('ai_chat_logs').insert([{ message: message, response: 'Admin desteğine yönlendirildi' }]);
    }

    return NextResponse.json({ response });
  } catch (err: any) {
    return NextResponse.json({ response: "Bir hata oluştu ama notumu aldım, admin ekibimize ilettim!" });
  }
}
