import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message } = await req.json();
  const lowerMsg = message.toLowerCase();

  // Botun kişiliği: Profesyonel bir şirket disiplini + ORISE Club enerjisi + Absürt mizah
  let responseText = "";

  // BİLGİ BANKASI VE PROFESYONEL YANITLAR
  if (lowerMsg.includes('iade') || lowerMsg.includes('para') || lowerMsg.includes('ücret')) {
    responseText = "İade süreçlerimizi profesyonel standartlarda yönetiyoruz. Onaylanan iadelerin tutarı, bankaların yoğunluğuna bağlı olarak 3-7 iş günü içinde kartınıza yansır. Bu süreçte bir aksilik olursa biz buradayız, rahat ol! 💳";
  } 
  else if (lowerMsg.includes('fatura') || lowerMsg.includes('mail') || lowerMsg.includes('e-fatura')) {
    responseText = "Dijitalleşmeyi seviyoruz! Tüm faturalarınız şirketimiz tarafından sisteminize kayıtlı e-posta adresinize dijital e-fatura olarak gönderiliyor. Spam kutusuna da bir göz atmanı öneririm, bazen oraya kaçabiliyorlar! 🧾";
  } 
  else if (lowerMsg.includes('etkinlik') || lowerMsg.includes('koşu') || lowerMsg.includes('voleybol')) {
    responseText = "ORISE Club etkinlik takvimimiz oldukça yoğun! Tüm buluşmalarımızı oriseclub.com üzerinden biletleyebilirsin. Unutma, etkinlikte ter dökmeye gelmeden önce feragatnameyi onaylaman yasal olarak şart; yani, 'ben bilmiyordum' bahanesi kabul edilmez, şaka şaka! 😉";
  } 
  else if (lowerMsg.includes('kimsiniz') || lowerMsg.includes('orise')) {
    responseText = "Biz, sporun ve tarzın birleştiği o nadir noktayız. ORISE Club olarak hem topluluk etkinlikleri düzenliyor, hem de @orisestore ile sokak giyimine yön veriyoruz. Yani özetle; hem terletiyoruz, hem giydiriyoruz. Çok yönlü şirketiz biz! 😎";
  }
  else {
    // Profesyonel ama esprili/absürt Fallback
    const fallbackOptions = [
      `"${message}" konusunu sistemime işledim. Eğer cevabı ben veremiyorsam, emin ol admin ekibimiz bunu benden daha iyi biliyordur. Bildirimi ilettim, en yakın zamanda profesyonel bir şekilde dönecekler! 🚀`,
      `Şu an ORISE Club sunucularında biraz voleybol maçı izliyordum da... 🏐 "${message}" sorunu yönetime ilettim, onlar daha resmi ama bir o kadar da nazik bir şekilde sana dönecekler.`,
      `Vay, oldukça derin bir soru! 🤔 "${message}" başlığı altında bu talebi şirket yetkililerimize raporluyorum. Bizde her şey kayıtlı, merak etme!`
    ];
    responseText = fallbackOptions[Math.floor(Math.random() * fallbackOptions.length)];
  }

  return NextResponse.json({ 
    response: responseText 
  });
}
