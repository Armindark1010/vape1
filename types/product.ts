export type CategoryId = 'pod' | 'salt' | 'disposable' | 'device' | 'coil'

export interface Category {
  id: CategoryId
  label: string
  icon: string
  desc: string
}

export interface FlavorOption {
  id: string
  name: string
  icon: string
  /** 0..5 میزان خنکی */
  cooling: number
  color: string
}

export interface FlavorProfile {
  /** 0..100 */
  sweetness: number
  /** 0..100 */
  cooling: number
  /** 0..100 */
  throatHit: number
}

export interface TechSpecs {
  battery: string
  coil: string
  tank: string
  charging: string
  airflow: string
  power?: string
  display?: string
  weight?: string
}

export interface Product {
  id: string
  name: string
  nameEn: string
  brand: string
  category: CategoryId
  tagline: string
  description: string
  /** قیمت به کرون سوئد */
  price: number
  oldPrice?: number
  images: string[]
  flavors: FlavorOption[]
  /** گزینه‌های نیکوتین (mg) */
  nicotine: number[]
  specs: TechSpecs
  profile: FlavorProfile
  rating: number
  reviews: number
  badges?: string[]
  /** تگ‌های هوشمند برای دستیار AI: fruit | ice | tobacco | dessert | cool */
  tags: string[]
  compatibleWith?: string[]
  inStock: boolean
  featured?: boolean
}

export const CATEGORIES: Category[] = [
  { id: 'pod', label: 'پاد و کارتریج', icon: '🔋', desc: 'جمع‌وجور و روزمره' },
  { id: 'salt', label: 'سالت نیکوتین', icon: '🧪', desc: 'طعم‌های غلیظ و نرم' },
  { id: 'disposable', label: 'یکبارمصرف', icon: '⚡', desc: 'بدون دردسر، آماده دود' },
  { id: 'device', label: 'دستگاه و ماد', icon: '🎛️', desc: 'قدرت و حجم بخار بالا' },
  { id: 'coil', label: 'کویل و لوازم', icon: '🌀', desc: 'قطعات و لوازم جانبی' },
]

export const categoryLabel = (id: CategoryId): string =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id

/** راهنمای انتخاب نیکوتین */
export const NICOTINE_GUIDE: Record<number, { label: string; desc: string; level: string }> = {
  0: { label: 'بدون نیکوتین', desc: 'فقط طعم و بخار، بدون گیرایی', level: 'تفریحی' },
  20: { label: 'سبک', desc: 'مناسب سیگاری‌های سبک و تازه‌کارها', level: 'ملایم' },
  30: { label: 'متوسط', desc: 'مناسب مصرف روزانه متوسط', level: 'متعادل' },
  50: { label: 'قوی', desc: 'مناسب سیگاری‌های سنگین', level: 'سنگین' },
}

export const formatPrice = (n: number): string =>
  `${new Intl.NumberFormat('sv-SE').format(n)} کرون`
