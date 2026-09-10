import { getProduct } from '~/data/products'

export interface CartItem {
  key: string
  productId: string
  flavorId?: string
  nicotine?: number
  qty: number
}

interface ToastMsg {
  id: number
  text: string
}

export const FREE_SHIPPING_FROM = 499
export const SHIPPING_COST = 49

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const toasts = ref<ToastMsg[]>([])

  // ---------- persistence ----------
  if (process.client) {
    try {
      const raw = localStorage.getItem('luxe-cart')
      if (raw) items.value = JSON.parse(raw)
    } catch {
      /* ignore */
    }
    watch(
      items,
      (v) => {
        try {
          localStorage.setItem('luxe-cart', JSON.stringify(v))
        } catch {
          /* ignore */
        }
      },
      { deep: true },
    )
  }

  // ---------- getters ----------
  const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const subtotal = computed(() =>
    items.value.reduce((s, i) => {
      const p = getProduct(i.productId)
      return s + (p ? p.price * i.qty : 0)
    }, 0),
  )
  const shipping = computed(() =>
    subtotal.value >= FREE_SHIPPING_FROM || subtotal.value === 0 ? 0 : SHIPPING_COST,
  )
  const total = computed(() => subtotal.value + shipping.value)
  const shipProgress = computed(() =>
    Math.min(100, Math.round((subtotal.value / FREE_SHIPPING_FROM) * 100)),
  )

  // ---------- actions ----------
  function add(productId: string, flavorId?: string, nicotine?: number, qty = 1) {
    const key = `${productId}|${flavorId ?? '-'}|${nicotine ?? '-'}`
    const found = items.value.find((i) => i.key === key)
    if (found) found.qty += qty
    else items.value.push({ key, productId, flavorId, nicotine, qty })
    const p = getProduct(productId)
    notify(p ? `${p.name} به سبد اضافه شد ✓` : 'به سبد اضافه شد ✓')
  }

  function setQty(key: string, qty: number) {
    const found = items.value.find((i) => i.key === key)
    if (!found) return
    if (qty <= 0) items.value = items.value.filter((i) => i.key !== key)
    else found.qty = Math.min(99, qty)
  }

  function remove(key: string) {
    items.value = items.value.filter((i) => i.key !== key)
  }

  function clear() {
    items.value = []
  }

  function notify(text: string) {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, text })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, 2600)
  }

  return {
    items,
    toasts,
    count,
    subtotal,
    shipping,
    total,
    shipProgress,
    add,
    setQty,
    remove,
    clear,
    notify,
  }
})
