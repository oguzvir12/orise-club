import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message } = await req.json();

  // Botun kişiliği: Enerjik, biraz şakacı ve spor tutkunu.
  const responseOptions = [
    `Selam şampiyon! 🔥 ${message} sorusuyla beni terlettin ama hallederiz. Kulüp işleri bende, admin'e ilettim bile!`,
    `Hadi ama, bu kadar kolay soruyla mı geliyorsun? 😂 Şaka şaka, sorduğun "${message}" konusu için notumu aldım, en hızlı şekilde dönüş yapıyoruz.`,
    `Dostum, antrenman modumdayım ama senin için kısa bir mola verdim! 💪 Söylediklerini admin'e uçurdum, o halledecek. Başka ne vardı?`,
    `Ooo, ORISE ruhu burada! 🚀 "${message}" ile ilgili bilgileri topluyorum, bu sırada sen bir şınav çek, hemen dönüyorum! Admin'e bildirim düştü bile.`
  ];

  // Rastgele bir cevap seç
  const randomResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];

  return NextResponse.json({ 
    response: randomResponse 
  });
}
