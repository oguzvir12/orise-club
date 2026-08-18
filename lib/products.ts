export type ProductCategory =
  | 'tshirt-sweatshirt'
  | 'hat-accessory'
  | 'socks-equipment'

export type Product = {
  id: string
  name: string
  category: ProductCategory
  fabric: string
  price: number
  image: string
  limited?: boolean
}

export const CATEGORIES: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'tshirt-sweatshirt', label: 'T-Shirt & Sweatshirt' },
  { id: 'hat-accessory', label: 'Şapka & Aksesuar' },
  { id: 'socks-equipment', label: 'Çorap & Ekipman' },
]

export const PRODUCTS: Product[] = [
  {
    id: 'trail-running-singlet',
    name: 'ORISE Pro Koşu Atleti — Siyah',
    category: 'tshirt-sweatshirt',
    fabric: 'Ultra Hafif Nefes Alabilir File Kumaş (90 GSM)',
    price: 950,
    image: '/products/Athlete_sprinting_uphill_on_trail_202608180854.jpeg',
    limited: true,
  },
  {
    id: 'crewneck-club-black',
    name: 'ORISE Club Bisiklet Yaka Sweatshirt — Siyah',
    category: 'tshirt-sweatshirt',
    fabric: '450 GSM Ağır Gramaj Şardonlu Pamuk',
    price: 2490,
    image: '/products/Black_crewneck_sweatshirt_flat_lay_202608181022.jpeg',
    limited: true,
  },
  {
    id: 'cap-structured-black',
    name: 'ORISE Atletik Kulüp Şapkası — Siyah',
    category: 'hat-accessory',
    fabric: '6 Panelli Pamuklu Dimi & Ayarlanabilir Kayış',
    price: 890,
    image: '/products/Black_athletic_cap_on_background_202608181021.jpeg',
  },
  {
    id: 'tote-canvas-black',
    name: 'ORISE Ağır Kanvas Bez Çanta — Siyah',
    category: 'hat-accessory',
    fabric: '16 oz Dayanıklı Organik Kanvas',
    price: 750,
    image: '/products/Black_canvas_tote_bag_standing_202608181022.jpeg',
  },
  {
    id: 'socks-performance-black',
    name: 'ORISE Performans Koşu Çorabı',
    category: 'socks-equipment',
    fabric: 'Coolmax Nefes Alabilir Örgü Dokuma',
    price: 320,
    image: '/products/socks.jpeg',
  },
  {
    id: 'bottle-insulated-steel',
    name: 'ORISE Paslanmaz Çelik Termos Matara 750ml',
    category: 'socks-equipment',
    fabric: 'Mat Siyah Çift Duvarlı Paslanmaz Çelik',
    price: 1150,
    image: '/products/Stainless_steel_water_bottle_pro..._202608181021.jpeg',
    limited: true,
  },
]
