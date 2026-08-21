import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message } = await req.json();
  const msg = message.toLowerCase();

  // BİLGİ BANKASI VE AKILLI YANITLAR
  let response = "";

  // 1. KİŞİSEL / SOSYAL
  if (msg.includes('naber') || msg.includes('selam') || msg.includes('merhaba')) {
    response = "Selam! ORISE Club olarak hareket halindeyiz, enerji tam gaz! 💪 Sen nasılsın? Kulüp veya Store hakkında neyi merak ediyorsun?";
  } 
  else if (msg.includes('yaş') || msg.includes('kaç yaşındasın')) {
    response = "ORISE Club ile doğdum, yani kulübün enerjisini taşıyorum. Ruhum hep 20, performansım ise 100! 😎";
  }
  
  // 2. FAALİYETLER & ETKİNLİKLER
  else if (msg.includes('branş') || msg.includes('etkinlik') || msg.includes('koşu') || msg.includes('yoga') || msg.includes('tenis') || msg.includes('voleybol') || msg.includes('yelken')) {
    response = "ORISE Club'da Koşu, Yürüyüş, Voleybol, Tenis, Yoga ve Yelken branşlarımız var. Etkinliklere oriseclub.com üzerinden bilet alarak veya kayıt oluşturarak katılabilirsin. Gelmeden önce dijital feragatnameyi onaylamayı unutma, güvenliğimiz her şeyden önemli! 🎾🏃‍♂️";
  }
  
  // 3. MAĞAZA, FATURA & İADE
  else if (msg.includes('iade') || msg.includes('para')) {
    response = "İade işlemlerini profesyonelce yönetiyoruz. İaden onaylandıktan sonra, bankanın hızına bağlı olarak 3-7 iş günü içinde paran kartına yansır. Sabırlı ol, ORISE güvencesindesin! 💳";
  }
  else if (msg.includes('fatura') || msg.includes('mail')) {
    response = "Siparişlerin ve biletlerin için dijital e-faturaların, sipariş sırasında kullandığın e-posta adresine otomatik gönderilir. Gelmediyse spam kutusunu kontrol etmeyi unutma! 🧾";
  }
  else if (msg.includes('ödeme') || msg.includes('güvenlik')) {
    response = "Tüm ödemelerimizi PayTr'nin güvenli sanal POS altyapısı üzerinden alıyoruz. Verilerin bizde ve PayTr'de şifreli bir şekilde güvende. Gönül rahatlığıyla hareketine odaklan! 🔒";
  }

  // 4. KİMLİK & İLETİŞİM
  else if (msg.includes('kimsiniz') || msg.includes('orise')) {
    response = "Biz ORISE Club'ız! Spor, hareket ve sokak giyimini (@orisestore) birleştiren bir topluluk hareketiyiz. Instagram'da @orisecommunity ve @orisestore hesaplarından bizi takip edebilirsin. Daha fazlası için oriseclub.com'a göz at! 🚀";
  }

  // 5. YETKİNLİK DIŞI / YÖNLENDİRME
  else {
    response = `"${message}" konusunu tam olarak anlayamadım ama ORISE Club ile ilgili olduğunu biliyorum! 🧐 Kulüp kurallarımız, etkinliklerimiz veya mağazamız hakkında daha net sorular sorarsan sana daha iyi yardımcı olabilirim. Eğer çok özel bir durumsa hemen admin ekibimize paslıyorum, sana en kısa sürede dönüş yapacaklar!`;
  }

  return NextResponse.json({ response });
}
