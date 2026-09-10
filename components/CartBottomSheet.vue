<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
        @click="open = false"
      />
    </Transition>
    <Transition name="sheet">
      <div
        v-if="open"
        class="glass-strong fixed inset-x-0 bottom-0 z-[71] mx-auto flex max-h-[88dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl shadow-neon-green"
        :style="sheetStyle"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div class="flex cursor-grab justify-center pb-1 pt-3" @touchstart.stop="onGripStart">
          <div class="h-1.5 w-12 rounded-full bg-white/20" />
        </div>

        <div class="flex items-center justify-between border-b border-white/10 px-4 pb-3">
          <p class="text-sm font-extrabold">🛒 سبد خرید <span class="text-neon-green">({{ toFa(cart.count) }})</span></p>
          <button
            class="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            aria-label="بستن"
            @click="open = false"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- موفقیت سفارش -->
        <div v-if="placed" class="flex flex-col items-center px-6 py-10 text-center">
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-neon-green/15 text-4xl shadow-neon-green">✅</div>
          <p class="mt-4 text-lg font-black">سفارشت ثبت شد!</p>
          <p class="mt-1 text-xs text-zinc-400">کد سفارش: <span class="font-black text-neon-green" dir="ltr">#{{ orderNo }}</span></p>
          <p class="mt-2 text-[13px] leading-6 text-zinc-300">به‌زودی با پیامک وضعیت ارسال رو بهت اطلاع می‌دیم. دود خوش! 💨</p>
          <button class="btn-neon mt-6 w-full" @click="open = false">باشه، ممنون!</button>
        </div>

        <template v-else>
          <!-- نوار ارسال رایگان -->
          <div v-if="cart.items.length > 0" class="border-b border-white/10 px-4 py-3">
            <p class="text-[11px] font-bold text-zinc-300">
              <template v-if="cart.shipping === 0">
                🎉 ارسال سفارشت <span class="text-neon-green">رایگان</span> شد!
              </template>
              <template v-else>
                تا ارسال رایگان فقط <span class="text-neon-ice">{{ formatPrice(FREE_SHIPPING_FROM - cart.subtotal) }}</span> مونده!
              </template>
            </p>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                class="h-full rounded-full bg-gradient-to-l from-neon-green to-neon-ice transition-all duration-500"
                :style="{ width: cart.shipProgress + '%' }"
              />
            </div>
          </div>

          <!-- آیتم‌ها -->
          <div ref="scrollRef" class="flex-1 space-y-2.5 overflow-y-auto px-4 py-3">
            <div v-if="cart.items.length === 0" class="flex flex-col items-center py-10 text-center">
              <span class="text-5xl opacity-60">🛒</span>
              <p class="mt-3 text-sm font-extrabold">سبدت خالیه!</p>
              <p class="mt-1 text-xs text-zinc-400">بذار دستیار هوشمند کمکت کنه 👇</p>
              <div class="mt-4 flex gap-2">
                <NuxtLink to="/products" class="btn-neon !px-5 !py-2.5 !text-xs" @click="open = false">مشاهده محصولات</NuxtLink>
                <button class="chip !py-2.5" @click="openAi">✨ مشاوره AI</button>
              </div>
            </div>

            <div
              v-for="i in detailed"
              :key="i.key"
              class="glass flex gap-3 rounded-2xl p-2.5"
            >
              <NuxtLink :to="`/products/${i.product.id}`" @click="open = false" class="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-ice/20">
                <img :src="i.product.images[0]" :alt="i.product.name" class="h-full w-full object-cover" loading="lazy" />
              </NuxtLink>
              <div class="min-w-0 flex-1">
                <p class="truncate text-xs font-extrabold">{{ i.product.name }}</p>
                <p class="mt-0.5 truncate text-[10px] text-zinc-400">
                  <span v-if="i.flavorName">{{ i.flavorName }} • </span>
                  <span v-if="i.nicotine !== undefined">نیکوتین {{ toFa(i.nicotine) }}mg</span>
                  <span v-else>بدون نیکوتین</span>
                </p>
                <div class="mt-1.5 flex items-center justify-between">
                  <div class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-1 py-0.5">
                    <button class="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-sm font-black" @click="cart.setQty(i.key, i.qty + 1)">＋</button>
                    <span class="min-w-[1.25rem] text-center text-xs font-black">{{ toFa(i.qty) }}</span>
                    <button class="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-sm font-black" @click="cart.setQty(i.key, i.qty - 1)">−</button>
                  </div>
                  <p class="text-xs font-black text-neon-green">{{ formatPrice(i.product.price * i.qty) }}</p>
                </div>
              </div>
              <button class="self-start rounded-lg p-1 text-zinc-500 transition hover:text-neon-pink" aria-label="حذف" @click="cart.remove(i.key)">🗑️</button>
            </div>
          </div>

          <!-- جمع‌بندی -->
          <div v-if="cart.items.length > 0" class="space-y-1.5 border-t border-white/10 px-4 pt-3 safe-bottom">
            <div class="flex justify-between text-xs text-zinc-400">
              <span>جمع اقلام</span><span>{{ formatPrice(cart.subtotal) }}</span>
            </div>
            <div class="flex justify-between text-xs text-zinc-400">
              <span>هزینه ارسال</span>
              <span v-if="cart.shipping === 0" class="font-bold text-neon-green">رایگان 🎉</span>
              <span v-else>{{ formatPrice(cart.shipping) }}</span>
            </div>
            <div class="flex justify-between border-t border-dashed border-white/10 pt-2 text-sm font-black">
              <span>مبلغ قابل پرداخت</span><span class="text-neon-green">{{ formatPrice(cart.total) }}</span>
            </div>
            <button class="btn-neon mt-2 w-full" @click="checkout">💳 ثبت سفارش و پرداخت</button>
          </div>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { getProduct } from '~/data/products'
import { formatPrice } from '~/types/product'
import { FREE_SHIPPING_FROM, useCartStore } from '~/stores/cart'

const open = useState<boolean>('cartOpen', () => false)
const assistantOpen = useState<boolean>('assistantOpen', () => false)
const cart = useCartStore()
const placed = ref(false)
const orderNo = ref('')
const scrollRef = ref<HTMLElement | null>(null)

const toFa = (n: number): string => n.toLocaleString('fa-IR')

const detailed = computed(() =>
  cart.items
    .map((i) => {
      const product = getProduct(i.productId)
      if (!product) return null
      return {
        ...i,
        product,
        flavorName: product.flavors.find((f) => f.id === i.flavorId)?.name,
      }
    })
    .filter(Boolean) as (CartItemFull)[],
)

interface CartItemFull {
  key: string
  qty: number
  nicotine?: number
  product: NonNullable<ReturnType<typeof getProduct>>
  flavorName?: string
}

function checkout() {
  orderNo.value = Math.floor(100000 + Math.random() * 900000).toString()
  placed.value = true
  cart.clear()
}

function openAi() {
  open.value = false
  setTimeout(() => (assistantOpen.value = true), 250)
}

watch(open, (v) => {
  if (v) placed.value = false
})

// ---------- درگ برای بستن ----------
const dragY = ref(0)
const dragging = ref(false)
let startY = 0
let canDrag = false
const sheetStyle = computed(() => ({
  transform: dragY.value ? `translateY(${dragY.value}px)` : '',
  transition: dragging.value ? 'none' : '',
}))
function onGripStart(e: TouchEvent) {
  canDrag = true
  startY = e.touches[0]?.clientY ?? 0
  dragging.value = true
  dragY.value = 0
}
function onTouchStart(e: TouchEvent) {
  const el = scrollRef.value
  if (el && el.scrollTop <= 0) {
    canDrag = true
    startY = e.touches[0]?.clientY ?? 0
    dragging.value = true
    dragY.value = 0
  }
}
function onTouchMove(e: TouchEvent) {
  if (!canDrag || !dragging.value) return
  const y = e.touches[0]?.clientY ?? 0
  const dy = y - startY
  if (dy > 0) dragY.value = dy
}
function onTouchEnd() {
  if (!dragging.value) return
  dragging.value = false
  canDrag = false
  if (dragY.value > 130) open.value = false
  dragY.value = 0
}
</script>
