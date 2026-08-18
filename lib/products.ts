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
    name: 'ORISE Pro Trail Running Singlet',
    category: 'tshirt-sweatshirt',
    fabric: 'Ultra-Light Breathable Micro-Mesh (90 GSM)',
    price: 950,
    image: '/products/Athlete_sprinting_uphill_on_trail_202608180854.jpeg',
    limited: true,
  },
  {
    id: 'tee-heavyweight-black',
    name: 'ORISE Heavyweight Tee — Black',
    category: 'tshirt-sweatshirt',
    fabric: '280 GSM Heavyweight Cotton',
    price: 1290,
    image: '/products/tee-black.png',
    limited: true,
  },
  {
    id: 'crewneck-club-graphite',
    name: 'ORISE Club Crewneck — Graphite',
    category: 'tshirt-sweatshirt',
    fabric: '450 GSM Brushed Fleece',
    price: 2490,
    image: '/products/sweatshirt-orange.png',
    limited: true,
  },
  {
    id: 'cap-structured-black',
    name: 'ORISE Structured Cap — Black',
    category: 'hat-accessory',
    fabric: '6-Panel Cotton Twill',
    price: 890,
    image: '/products/cap-black.png',
  },
  {
    id: 'tote-canvas',
    name: 'ORISE Heavy Canvas Tote',
    category: 'hat-accessory',
    fabric: '16 oz Organic Canvas',
    price: 750,
    image: '/products/tote-bag.png',
  },
  {
    id: 'socks-performance',
    name: 'ORISE Performance Socks',
    category: 'socks-equipment',
    fabric: 'Coolmax Knit Blend',
    price: 320,
    image: '/products/socks.png',
  },
  {
    id: 'bottle-insulated',
    name: 'ORISE Insulated Bottle 750ml',
    category: 'socks-equipment',
    fabric: 'Matte Stainless Steel',
    price: 1150,
    image: '/products/bottle.png',
    limited: true,
  },
]
