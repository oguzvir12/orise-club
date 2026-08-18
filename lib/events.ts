export type SportType = 'volleyball' | 'yoga' | 'running' | 'tennis'

export type OriseEvent = {
  id: string
  day: string
  date: string
  time: string
  location: string
  title: string
  sport: SportType
  note?: string
  registrationUrl?: string
}

export const EVENT_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfJRN2-iQXB7Cq958-2dITBaAYALQ983dUJac8MgXZQysa2hg/viewform'

export const EVENTS: OriseEvent[] = [
  {
    id: 'evt-1',
    day: 'Çarşamba',
    date: '19 Ağustos',
    time: '19:30',
    location: 'Simple Coffee → Fenerbahçe Dalyan Sahili',
    title: 'Rutin Akşam Koşusu',
    sport: 'running',
    registrationUrl: EVENT_FORM_URL,
  },
  {
    id: 'evt-2',
    day: 'Cuma',
    date: '21 Ağustos',
    time: '21:30',
    location: 'Maltepe Sahil',
    title: 'Plaj Voleybol Maçı ve Antrenman',
    sport: 'volleyball',
    registrationUrl: EVENT_FORM_URL,
  },
  {
    id: 'evt-3',
    day: 'Cumartesi',
    date: '22 Ağustos',
    time: '10:00',
    location: 'Fenerbahçe Dalyan Sahili',
    title: 'Yoga Buluşması',
    sport: 'yoga',
    note: 'Eylül Bilim ve Sanat Akademisi canlı bateri performansı & DOPPIO Fika Point kahve ikramı ile.',
    registrationUrl: EVENT_FORM_URL,
  },
  {
    id: 'evt-4',
    day: 'Pazar',
    date: '23 Ağustos',
    time: '08:00',
    location: 'Simple Coffee → Fenerbahçe Dalyan Sahili',
    title: 'Rutin Sabah Koşusu',
    sport: 'running',
    registrationUrl: EVENT_FORM_URL,
  },
  {
    id: 'evt-5',
    day: 'Pazartesi',
    date: '24 Ağustos',
    time: '21:30',
    location: 'Maltepe, Aydınevler',
    title: 'Rutin Saha Voleybol Maçı',
    sport: 'volleyball',
    registrationUrl: EVENT_FORM_URL,
  },
  {
    id: 'evt-6',
    day: 'Çarşamba',
    date: '26 Ağustos',
    time: '19:30',
    location: 'Simple Coffee → Fenerbahçe Dalyan Sahili',
    title: 'Rutin Akşam Koşusu',
    sport: 'running',
    registrationUrl: EVENT_FORM_URL,
  },
  {
    id: 'evt-7',
    day: 'Cuma',
    date: '28 Ağustos',
    time: '21:30',
    location: 'Maltepe Sahil',
    title: 'Plaj Voleybol Maçı ve Antrenman',
    sport: 'volleyball',
    registrationUrl: EVENT_FORM_URL,
  },
  {
    id: 'evt-8',
    day: 'Cumartesi',
    date: '29 Ağustos',
    time: '10:00',
    location: 'Fenerbahçe Dalyan Sahili',
    title: 'Sahil Yoga & Nefes Buluşması',
    sport: 'yoga',
    registrationUrl: EVENT_FORM_URL,
  },
  {
    id: 'evt-9',
    day: 'Pazar',
    date: '30 Ağustos',
    time: '08:00',
    location: 'Simple Coffee → Fenerbahçe Dalyan Sahili',
    title: '30 Ağustos Zafer Koşusu',
    sport: 'running',
    note: 'Zafer Bayramı Özel Kulüp Koşusu.',
    registrationUrl: EVENT_FORM_URL,
  },
  {
    id: 'evt-10',
    day: 'Pazartesi',
    date: '31 Ağustos',
    time: '21:30',
    location: 'Maltepe, Aydınevler',
    title: 'Rutin Saha Voleybol Maçı',
    sport: 'volleyball',
    registrationUrl: EVENT_FORM_URL,
  },
]
