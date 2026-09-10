<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[70] bg-black/75 backdrop-blur-md"
        @click="open = false"
      />
    </Transition>
    <Transition name="sheet">
      <div
        v-if="open"
        class="glass-strong fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:start-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[71] mx-auto flex max-h-[90dvh] md:max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[2rem] md:rounded-[2rem] shadow-neon-green border border-white/[0.18]"
        :style="sheetStyle"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <!-- دستگیره درگ فقط برای موبایل -->
        <div class="md:hidden flex cursor-grab justify-center pb-1 pt-3" @touchstart.stop="onGripStart">
          <div class="h-1.5 w-12 rounded-full bg-white/20" />
        </div>

        <!-- هدر سبد خرید -->
        <div class="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-white/[0.02]">
          <h3 class="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <span>🛒</span>
            <span>سبد خرید شما</span>
            <span class="rounded-full bg-neon-green/20 px-2 py-0.5 text-xs font-black text-neon-green border border-neon-green/40">
              {{ toFa(cart.count) }} کالا
            </span>
          </h3>

          <button
            class="rounded-full border border-white/10 bg-white/[0.06] p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white active:scale-90"
            aria-label="بستن سبد خرید"
            @click="open = false"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- صفحه موفقیت ثبت سفارش -->
        <div v-if="placed" class="flex flex-col items-center px-6 py-12 text-center space-y-3">
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-neon-green/20 border border-neon-green/50 text-4xl shadow-neon-green">
            ✅
          </div>
          <h3 class="text-lg sm:text-xl font-black text-white">سفارش شما با موفقیت ثبت شد!</h3>
          <p class="text-xs text-zinc-300">
            کد رهگیری سفارش: <span class="font-mono font-black text-neon-green text-sm" dir="ltr">#{{ orderNo }}</span>
          </p>
          <p class="text-xs sm:text-sm leading-relaxed text-zinc-300 max-w-sm pt-2">
            سفارش شما در سریع‌ترین زمان ممکن بسته‌بندی و ارسال خواهد شد. پیامک رهگیری به زودی ارسال می‌شود. دود خوش! 💨
          </p>
          <button class="btn-neon mt-4 w-full !py-3.5" @click="open = false">
            متوجه شدم، بازگشت به فروشگاه
          </button>
        </div>

        <template v-else>
          <!-- نوار پیشرفت ارسال رایگان -->
          <div v-if="cart.items.length > 0" class="border-b border-white/10 px-5 py-3 bg-[#101018]">
            <p class="text-xs font-bold text-zinc-200">
              <template v-if="cart.shipping === 0">
                🎉 تبریک! ارسال سفارش شما <span class="text-neon-green font-black">کاملاً رایگان</span> شد!
              </template>
              <template v-else>
                تنها <span class="text-neon-ice font-black">{{ formatPrice(FREE_SHIPPING_FROM - cart.subtotal) }}</span> تا ارسال رایگان فاصله دارید!
              </template>
            </p>
            <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10 p-0.5">
              <div
                class="h-full rounded-full bg-gradient-to-l from-neon-green to-neon-ice transition-all duration-500 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                :style="{ width: cart.shipProgress + '%' }"
              />
            </div>
          </div>

          <!-- لیست اقلام سبد خرید -->
          <div ref="scrollRef" class="flex-1 space-y-3 overflow-y-auto px-4 sm:px-5 py-3.5">
            <!-- سبد خالی -->
            <div v-if="cart.items.length === 0" class="flex flex-col items-center py-12 text-center space-y-3">
              <span class="text-6xl opacity-70">🛒</span>
              <h4 class="text-base font-black text-white">سبد خرید شما خالی است!</h4>
              <p class="text-xs text-zinc-400 max-w-xs">
                می‌توانید محصولات فروشگاه را بررسی کنید یا از هوش مصنوعی ساملیه کمک بگیرید 👇
              </p>
              <div class="flex gap-2.5 pt-2">
                <NuxtLink to="/products" class="btn-neon !py-2.5 !px-5 !text-xs" @click="open = false">
                  🛍️ مشاهده محصولات
                </NuxtLink>
                <button class="chip !py-2.5" @click="openAi">
                  ✨ مشاوره با AI
                </button>
              </div>
            </div>

            <!-- آیتم‌های پر شده -->
            <div
              v-for="i in detailed"
              :key="i.key"
              class="glass flex gap-3.5 rounded-2xl p-3 items-center border-white/[0.12]"
            >
              <NuxtLink
                :to="`/products/${i.product.id}`"
                class="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#14141e] p-1 flex items-center justify-center"
                @click="open = false"
              >
                <img :src="i.product.images[0]" :alt="i.product.name" class="h-full w-full object-contain" loading="lazy" />
              </NuxtLink>

              <div class="min-w-0 flex-1 space-y-1">
                <h4 class="truncate text-xs sm:text-sm font-black text-white">{{ i.product.name }}</h4>
                <div class="flex items-center gap-2 text-[10px] text-zinc-400 flex-wrap">
                  <span v-if="i.flavorName" class="rounded bg-white/[0.06] px-1.5 py-0.5 text-zinc-300">
                    {{ i.flavorName }}
                  </span>
                  <span v-if="i.nicotine !== undefined" class="rounded bg-white/[0.06] px-1.5 py-0.5 text-zinc-300">
                    نیکوتین: {{ toFa(i.nicotine) }}mg
                  </span>
                  <span v-else class="rounded bg-white/[0.06] px-1.5 py-0.5 text-zinc-300">بدون نیکوتین</span>
                </div>

                <div class="flex items-center justify-between pt-1">
                  <!-- استپر تعداد -->
                  <div class="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-1.5 py-0.5">
                    <button
                      class="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs font-black text-white active:scale-90"
                      @click="cart.setQty(i.key, i.qty + 1)"
                    >
                      ＋
                    </button>
                    <span class="min-w-[1.2rem] text-center text-xs font-black text-white">{{ toFa(i.qty) }}</span>
                    <button
                      class="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs font-black text-white active:scale-90"
                      @click="cart.setQty(i.key, i.qty - 1)"
                    >
                      −
                    </button>
                  </div>

                  <p class="text-xs sm:text-sm font-black text-neon-green">
                    {{ formatPrice(i.product.price * i.qty) }}
                  </p>
                </div>
              </div>

              <!-- دکمه حذف -->
              <button
                class="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-zinc-400 transition hover:border-neon-pink/40 hover:text-neon-pink active:scale-90"
                aria-label="حذف کالا"
                @click="cart.remove(i.key)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- بخش جمع‌بندی و ثبت سفارش نهایی -->
          <div v-if="cart.items.length > 0" class="border-t border-white/10 p-4 sm:p-5 safe-bottom bg-[#0a0a0f] space-y-2.5">
            <div class="flex justify-between text-xs text-zinc-300">
              <span>جمع قیمت کالاها:</span>
              <span class="font-bold">{{ formatPrice(cart.subtotal) }}</span>
            </div>

            <div class="flex justify-between text-xs text-zinc-300">
              <span>هزینه ارسال:</span>
              <span v-if="cart.shipping === 0" class="font-black text-neon-green">رایگان 🎉</span>
              <span v-else class="font-bold">{{ formatPrice(cart.shipping) }}</span>
            </div>

            <div class="flex justify-between border-t border-dashed border-white/15 pt-2.5 text-sm sm:text-base font-black text-white">
              <span>مبلغ نهایی پرداخت:</span>
              <span class="text-neon-green">{{ formatPrice(cart.total) }}</span>
            </div>

            <button class="btn-neon mt-3 w-full !py-3.5 !text-sm" @click="checkout">
              💳 ثبت سفارش و پرداخت نهایی
            </button>
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
    .filter(Boolean) as CartItemFull[],
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
  setTimeout(() => (assistantOpen.value = true), 200)
}

watch(open, (v) => {
  if (v) placed.value = false
})

// درگ برای بستن در موبایل
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
  if (dragY.value > 120) open.value = false
  dragY.value = 0
}
</script>
