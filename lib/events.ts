export type SportType = 'volleyball' | 'yoga' | 'running'

export type OriseEvent = {
  id: string
  day: string
  date: string
  time: string
  location: string
  title: string
  sport: SportType
  note?: string
}

export const EVENTS: OriseEvent[] = [
  {
    id: 'evt-1',
    day: 'Cuma',
    date: '14 Ağustos',
    time: '21:30',
    location: 'Maltepe Sahil',
    title: 'Plaj Voleybol Maçı ve Antrenman',
    sport: 'volleyball',
  },
  {
    id: 'evt-2',
    day: 'Cumartesi',
    date: '15 Ağustos',
    time: '10:00',
    location: 'Fenerbahçe Dalyan Sahili',
    title: 'Yoga Buluşması',
    sport: 'yoga',
    note: 'Eylül Bilim ve Sanat Akademisi canlı bateri performansı & DOPPIO Fika Point kahve ikramı ile.',
  },
  {
    id: 'evt-3',
    day: 'Pazar',
    date: '16 Ağustos',
    time: '08:00',
    location: 'Simple Coffee → Fenerbahçe Dalyan Sahili',
    title: 'Sabah Koşusu',
    sport: 'running',
  },
  {
    id: 'evt-4',
    day: 'Pazartesi',
    date: '17 Ağustos',
    time: '21:30',
    location: 'Maltepe, Aydınevler',
    title: 'Rutin Saha Voleybol Maçı',
    sport: 'volleyball',
  },
  {
    id: 'evt-5',
    day: 'Çarşamba',
    date: '19 Ağustos',
    time: '19:30',
    location: 'Simple Coffee → Fenerbahçe Dalyan Sahili',
    title: 'Rutin Akşam Koşusu',
    sport: 'running',
  },
]
