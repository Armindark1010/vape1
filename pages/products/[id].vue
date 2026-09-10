<template>
  <div>
    <!-- ===== حالت پیدا نشدن ===== -->
    <div v-if="!product" class="flex flex-col items-center py-20 text-center">
      <span class="text-6xl">😶‍🌫️</span>
      <p class="mt-4 text-base font-black">این محصول پیدا نشد!</p>
      <NuxtLink to="/products" class="btn-neon mt-5">بازگشت به فروشگاه</NuxtLink>
    </div>

    <template v-else>
      <!-- ===== نوبار بالا ===== -->
      <div class="sticky top-[68px] z-30 -mx-4 flex items-center gap-2 bg-vapor-950/70 px-4 py-2 backdrop-blur-xl">
        <button
          class="rounded-xl border border-white/10 bg-white/[0.06] p-2 transition active:scale-90"
          aria-label="بازگشت"
          @click="$router.back()"
        >
          <svg class="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6" />
          </svg>
        </button>
        <p class="flex-1 truncate text-xs font-extrabold">{{ product.name }}</p>
        <button
          class="rounded-xl border border-white/10 bg-white/[0.06] p-2 transition active:scale-90"
          aria-label="اشتراک‌گذاری"
          @click="share"
        >
          📤
        </button>
      </div>

      <!-- ===== گالری ===== -->
      <section class="relative mt-2 overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-neon-purple/10 via-vapor-800 to-neon-ice/10">
        <div
          class="gallery-track flex"
          :style="{ transform: `translateX(${activeImg * 100}%)` }"
          @touchstart="gStart"
          @touchend="gEnd"
        >
          <div
            v-for="(img, i) in product.images"
            :key="i"
            class="relative aspect-square w-full shrink-0"
            @click="zoom = true"
          >
            <img :src="img" :alt="`${product.name} - تصویر ${i + 1}`" class="h-full w-full object-cover" />
          </div>
        </div>

        <div class="absolute start-3 top-3 flex flex-col gap-1">
          <span
            v-for="b in product.badges"
            :key="b"
            class="rounded-full bg-vapor-950/70 px-2.5 py-1 text-[10px] font-extrabold text-neon-green backdrop-blur-md"
          >
            {{ b }}
          </span>
        </div>
        <span v-if="discount" class="absolute end-3 top-3 rounded-full bg-neon-pink px-2.5 py-1 text-[11px] font-black text-white shadow-lg">
          ٪{{ toFa(discount) }} تخفیف
        </span>

        <div class="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
          <button
            v-for="(_, i) in product.images"
            :key="i"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="i === activeImg ? 'w-6 bg-neon-purple shadow-neon-purple' : 'w-1.5 bg-white/30'"
            :aria-label="`تصویر ${i + 1}`"
            @click="activeImg = i"
          />
        </div>
        <span class="absolute bottom-3 end-3 rounded-full bg-vapor-950/60 px-2 py-0.5 text-[10px] font-bold text-zinc-300 backdrop-blur-md">
          🔍 لمس برای زوم
        </span>
      </section>

      <!-- تصاویر بندانگشتی -->
      <div class="mt-2 flex gap-2">
        <button
          v-for="(img, i) in product.images"
          :key="i"
          class="h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition"
          :class="i === activeImg ? 'border-neon-purple shadow-neon-purple' : 'border-white/10 opacity-60'"
          @click="activeImg = i"
        >
          <img :src="img" :alt="`بندانگشتی ${i + 1}`" class="h-full w-full object-cover" loading="lazy" />
        </button>
      </div>

      <!-- ===== اطلاعات پایه ===== -->
      <section class="mt-3">
        <p class="text-[11px] font-bold text-zinc-500">{{ product.brand }} • {{ categoryLabel(product.category) }}</p>
        <h1 class="mt-1 text-xl font-black leading-8">{{ product.name }}</h1>
        <p class="mt-0.5 text-[11px] text-zinc-500" dir="ltr">{{ product.nameEn }}</p>
        <p class="mt-1.5 text-xs leading-6 text-neon-ice/90">✨ {{ product.tagline }}</p>

        <div class="mt-2 flex items-center gap-2">
          <span class="rounded-full bg-white/[0.07] px-2.5 py-1 text-[11px] font-black">⭐ {{ toFa(product.rating) }}</span>
          <span class="text-[11px] text-zinc-500">{{ toFa(product.reviews) }} نظر کاربران</span>
          <span class="ms-auto flex items-center gap-1 text-[11px] font-bold text-neon-green">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-green" /> موجود در انبار
          </span>
        </div>

        <div class="mt-2.5 flex items-end gap-2">
          <p class="text-2xl font-black text-neon-green">{{ formatPrice(product.price) }}</p>
          <p v-if="product.oldPrice" class="pb-1 text-sm text-zinc-500 line-through">{{ formatPrice(product.oldPrice) }}</p>
        </div>
      </section>

      <!-- ===== انتخاب طعم ===== -->
      <section class="glass mt-4 rounded-3xl p-4">
        <div class="mb-2.5 flex items-center justify-between">
          <h2 class="text-[13px] font-black">🎨 انتخاب طعم / رنگ</h2>
          <IceMeter :level="selectedFlavor?.cooling ?? 0" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="f in product.flavors"
            :key="f.id"
            class="flex items-center gap-2 rounded-2xl border-2 p-2.5 text-start transition active:scale-95"
            :class="selectedFlavorId === f.id ? 'border-neon-purple bg-neon-purple/10 shadow-neon-purple' : 'border-white/10 bg-white/[0.04]'"
            @click="selectedFlavorId = f.id"
          >
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg" :style="{ background: f.color + '2e' }">
              {{ f.icon }}
            </span>
            <span class="min-w-0">
              <span class="block truncate text-xs font-extrabold">{{ f.name }}</span>
              <span class="block text-[10px] text-zinc-400">❄ خنکی {{ toFa(f.cooling) }}/۵</span>
            </span>
          </button>
        </div>
      </section>

      <!-- ===== انتخاب نیکوتین ===== -->
      <section class="glass mt-3 rounded-3xl p-4">
        <h2 class="mb-2.5 text-[13px] font-black">🧪 میزان نیکوتین</h2>
        <div class="flex gap-2">
          <button
            v-for="n in product.nicotine"
            :key="n"
            class="flex-1 rounded-2xl border-2 py-2.5 text-sm font-black transition active:scale-95"
            :class="selectedNicotine === n ? 'border-neon-green bg-neon-green/10 text-neon-green shadow-neon-green' : 'border-white/10 bg-white/[0.04] text-zinc-300'"
            @click="selectedNicotine = n"
          >
            <span dir="ltr">{{ n }}mg</span>
          </button>
        </div>
        <div v-if="nicGuide" class="mt-2.5 rounded-2xl border border-neon-ice/20 bg-neon-ice/5 p-3 text-[11px] leading-5 text-zinc-300">
          <span class="font-black text-neon-ice">{{ nicGuide.label }} ({{ nicGuide.level }})</span>
          — {{ nicGuide.desc }}
        </div>
      </section>

      <!-- ===== پروفایل طعم ===== -->
      <section class="glass mt-3 rounded-3xl p-4">
        <h2 class="mb-3 text-[13px] font-black">📊 پروفایل طعم</h2>
        <FlavorProfileBars :profile="product.profile" />
      </section>

      <!-- ===== مشخصات فنی ===== -->
      <section class="glass mt-3 rounded-3xl p-4">
        <h2 class="mb-3 text-[13px] font-black">⚙️ مشخصات فنی</h2>
        <dl class="divide-y divide-white/5">
          <div v-for="s in specRows" :key="s.label" class="flex items-center gap-2.5 py-2.5">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-base">{{ s.icon }}</span>
            <dt class="text-[11px] font-bold text-zinc-400">{{ s.label }}</dt>
            <dd class="ms-auto text-end text-xs font-extrabold">{{ s.value }}</dd>
          </div>
        </dl>
      </section>

      <!-- ===== سازگاری ===== -->
      <section v-if="compatible.length > 0" class="mt-3 rounded-3xl border border-neon-amber/25 bg-neon-amber/[0.06] p-4">
        <h2 class="text-[13px] font-black text-neon-amber">⚠️ سازگار با این دستگاه</h2>
        <p class="mt-1 text-[11px] leading-5 text-zinc-400">این اقلام با «{{ product.name }}» کاملاً سازگارن و پیشنهاد می‌شن:</p>
        <div class="mt-2.5 space-y-2">
          <div v-for="c in compatible" :key="c.id" class="glass flex items-center gap-2.5 rounded-2xl p-2">
            <NuxtLink :to="`/products/${c.id}`" class="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/5">
              <img :src="c.images[0]" :alt="c.name" class="h-full w-full object-cover" loading="lazy" />
            </NuxtLink>
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-extrabold">{{ c.name }}</p>
              <p class="text-[11px] font-bold text-neon-green">{{ formatPrice(c.price) }}</p>
            </div>
            <button
              class="rounded-xl bg-neon-green/15 px-3 py-2 text-[11px] font-black text-neon-green transition active:scale-90"
              @click="cart.add(c.id, c.flavors[0]?.id, c.nicotine.includes(0) ? undefined : c.nicotine[0], 1)"
            >
              ＋ افزودن
            </button>
          </div>
        </div>
      </section>

      <!-- ===== توضیحات ===== -->
      <section class="glass mt-3 rounded-3xl p-4">
        <h2 class="mb-2 text-[13px] font-black">📝 درباره این محصول</h2>
        <p class="text-xs leading-7 text-zinc-300">{{ product.description }}</p>
      </section>

      <!-- ===== مشاوره AI ===== -->
      <button
        class="mt-3 flex w-full items-center gap-3 rounded-3xl border border-neon-purple/30 bg-gradient-to-l from-neon-purple/15 to-neon-ice/10 p-4 text-start transition active:scale-[0.98]"
        @click="assistantOpen = true"
      >
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue text-xl shadow-neon-purple">✨</span>
        <span>
          <span class="block text-[13px] font-black">مطمئن نیستی؟ از ساملیه بپرس!</span>
          <span class="block text-[11px] text-zinc-400">مشاوره هوشمند طعم و نیکوتین، رایگان ✨</span>
        </span>
      </button>

      <!-- ===== محصولات مرتبط ===== -->
      <section class="mt-5">
        <h2 class="mb-2.5 text-sm font-black">🔗 محصولات مرتبط</h2>
        <div class="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          <ProductCard
            v-for="(r, i) in related"
            :key="r.id"
            :product="r"
            :index="i"
            class="w-40 shrink-0"
          />
        </div>
      </section>

      <!-- فضای اکشن‌بار -->
      <div class="h-24" />

      <!-- ===== اکشن‌بار چسبان ===== -->
      <div class="fixed inset-x-0 bottom-0 z-[60] mx-auto w-full max-w-md px-3 pb-[max(env(safe-area-inset-bottom),0.6rem)]">
        <div class="glass-strong rounded-3xl p-2.5 shadow-glass">
          <div class="flex items-center gap-2">
            <button
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-neon-purple/40 bg-neon-purple/15 text-xl transition active:scale-90"
              aria-label="مشاوره AI"
              @click="assistantOpen = true"
            >
              ✨
            </button>
            <div class="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-2 py-1.5">
              <button class="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-base font-black" aria-label="کمتر" @click="qty = Math.max(1, qty - 1)">−</button>
              <span class="min-w-[1.25rem] text-center text-sm font-black">{{ toFa(qty) }}</span>
              <button class="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-base font-black" aria-label="بیشتر" @click="qty = Math.min(99, qty + 1)">＋</button>
            </div>
            <button class="btn-neon min-w-0 flex-1 !px-3 !py-3 !text-[13px]" @click="addToCart">
              <span v-if="!added">🛒 افزودن • {{ formatPrice(product.price * qty) }}</span>
              <span v-else>✓ اضافه شد!</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ===== زوم تمام‌صفحه ===== -->
      <Teleport to="body">
        <Transition name="fade">
          <div
            v-if="zoom"
            class="fixed inset-0 z-[90] flex items-center justify-center bg-vapor-950/95 p-4 backdrop-blur-md"
            @click="zoom = false"
          >
            <img
              :src="product.images[activeImg]"
              :alt="product.name"
              class="max-h-full max-w-full rounded-2xl object-contain shadow-neon-purple"
            />
            <span class="absolute bottom-8 rounded-full bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur-md">👆 برای بستن لمس کن</span>
          </div>
        </Transition>
      </Teleport>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getProduct, relatedProducts } from '~/data/products'
import { NICOTINE_GUIDE, categoryLabel, formatPrice } from '~/types/product'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const cart = useCartStore()
const assistantOpen = useState<boolean>('assistantOpen', () => false)
const cartOpen = useState<boolean>('cartOpen', () => false)

const id = computed(() => route.params.id as string)
const product = computed(() => getProduct(id.value))
const related = computed(() => relatedProducts(id.value, 4))
const compatible = computed(() =>
  (product.value?.compatibleWith ?? [])
    .map((cid) => getProduct(cid))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[],
)

useHead(() => ({ title: product.value ? product.value.name : 'محصول' }))

// ---------- انتخاب‌ها ----------
const selectedFlavorId = ref('')
const selectedNicotine = ref<number | undefined>(undefined)
const qty = ref(1)
const added = ref(false)

watch(
  product,
  (p) => {
    if (!p) return
    selectedFlavorId.value = p.flavors[0]?.id ?? ''
    const pref = [30, 20, 50, 0].find((n) => p.nicotine.includes(n))
    selectedNicotine.value = pref ?? p.nicotine[0]
  },
  { immediate: true },
)

const selectedFlavor = computed(() =>
  product.value?.flavors.find((f) => f.id === selectedFlavorId.value),
)
const nicGuide = computed(() =>
  selectedNicotine.value !== undefined ? NICOTINE_GUIDE[selectedNicotine.value] : null,
)
const discount = computed(() =>
  product.value?.oldPrice
    ? Math.round(((product.value.oldPrice - product.value.price) / product.value.oldPrice) * 100)
    : 0,
)

const specRows = computed(() => {
  const s = product.value?.specs
  if (!s) return []
  const rows = [
    { icon: '🔋', label: 'باتری', value: s.battery },
    { icon: '🌀', label: 'کویل', value: s.coil },
    { icon: '🧪', label: 'مخزن', value: s.tank },
    { icon: '🔌', label: 'شارژ', value: s.charging },
    { icon: '🌬️', label: 'ایرفلو', value: s.airflow },
  ]
  if (s.power) rows.push({ icon: '⚡', label: 'توان', value: s.power })
  if (s.display) rows.push({ icon: '📟', label: 'نمایشگر', value: s.display })
  if (s.weight) rows.push({ icon: '⚖️', label: 'وزن', value: s.weight })
  return rows.filter((r) => r.value && r.value !== '—')
})

// ---------- گالری ----------
const activeImg = ref(0)
const zoom = ref(false)
let gx = 0
function gStart(e: TouchEvent) {
  gx = e.touches[0]?.clientX ?? 0
}
function gEnd(e: TouchEvent) {
  const dx = (e.changedTouches[0]?.clientX ?? 0) - gx
  const len = product.value?.images.length ?? 1
  if (dx < -40) activeImg.value = (activeImg.value + 1) % len
  else if (dx > 40) activeImg.value = (activeImg.value - 1 + len) % len
}

// ---------- اکشن‌ها ----------
const toFa = (n: number): string =>
  n.toLocaleString('fa-IR', { maximumFractionDigits: 1 })

function addToCart() {
  if (!product.value) return
  cart.add(product.value.id, selectedFlavorId.value || undefined, selectedNicotine.value, qty.value)
  added.value = true
  setTimeout(() => (added.value = false), 1600)
}

async function share() {
  if (!product.value) return
  const url = window.location.href
  try {
    if (navigator.share) {
      await navigator.share({ title: product.value.name, url })
    } else {
      await navigator.clipboard.writeText(url)
      cart.notify('لینک محصول کپی شد 📋')
    }
  } catch {
    /* لغو توسط کاربر */
  }
}
</script>
