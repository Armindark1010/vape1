<template>
  <div class="space-y-6 pt-4 sm:pt-6">
    <!-- ===== حالت عدم یافتن محصول ===== -->
    <div v-if="!product" class="glass flex flex-col items-center py-20 px-4 text-center rounded-3xl">
      <span class="text-6xl">😶‍🌫️</span>
      <h2 class="mt-4 text-lg sm:text-xl font-black text-white">محصول مورد نظر پیدا نشد!</h2>
      <p class="mt-1 text-xs text-zinc-400">ممکن است موجودی این کالا به اتمام رسیده باشد.</p>
      <NuxtLink to="/products" class="btn-neon mt-6 !px-6">بازگشت به فروشگاه</NuxtLink>
    </div>

    <template v-else>
      <!-- بردکرامب و دکمه بازگشت -->
      <nav class="flex items-center justify-between text-xs text-zinc-400">
        <div class="flex items-center gap-1.5 flex-wrap">
          <NuxtLink to="/" class="hover:text-white transition">خانه</NuxtLink>
          <span>/</span>
          <NuxtLink to="/products" class="hover:text-white transition">فروشگاه</NuxtLink>
          <span>/</span>
          <NuxtLink :to="`/products?cat=${product.category}`" class="hover:text-white transition">
            {{ categoryLabel(product.category) }}
          </NuxtLink>
          <span>/</span>
          <span class="text-white font-bold truncate max-w-[12rem] sm:max-w-xs">{{ product.name }}</span>
        </div>

        <button
          class="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white flex items-center gap-1"
          @click="share"
        >
          <span>📤</span>
          <span class="hidden sm:inline">اشتراک‌گذاری</span>
        </button>
      </nav>

      <!-- ساختار ۲ ستونه ریسپانسیو در دسکتاپ -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <!-- ستون گالری تصاویر (موبایل و دسکتاپ) -->
        <div class="lg:col-span-6 space-y-3 lg:sticky lg:top-24">
          <!-- تصویر اصلی گالری -->
          <div class="glass relative overflow-hidden rounded-[2rem] border border-white/[0.15] bg-[#0c0c14]/90 p-4 sm:p-6 flex items-center justify-center">
            <!-- بج‌های محصول -->
            <div class="absolute start-4 top-4 flex flex-col gap-1.5 z-10">
              <span
                v-for="b in product.badges"
                :key="b"
                class="rounded-full border border-neon-green/40 bg-neon-green/15 px-3 py-1 text-[11px] font-black text-neon-green backdrop-blur-md shadow-sm"
              >
                {{ b }}
              </span>
            </div>

            <!-- بج تخفیف -->
            <span v-if="discount" class="absolute end-4 top-4 z-10 rounded-full border border-neon-pink/40 bg-neon-pink px-3 py-1 text-xs font-black text-white shadow-lg">
              ٪{{ toFa(discount) }} تخفیف
            </span>

            <!-- کادر اسلایدر گالری -->
            <div
              class="gallery-track flex w-full aspect-square items-center cursor-zoom-in"
              @touchstart="gStart"
              @touchend="gEnd"
              @click="zoom = true"
            >
              <img
                :src="product.images[activeImg]"
                :alt="`${product.name} - تصویر ${activeImg + 1}`"
                class="h-full w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] transition-all duration-300"
              />
            </div>

            <!-- دات‌های اسلایدر در موبایل -->
            <div class="absolute inset-x-0 bottom-4 flex items-center justify-center gap-1.5 z-10">
              <button
                v-for="(_, i) in product.images"
                :key="i"
                class="h-1.5 rounded-full transition-all duration-300"
                :class="i === activeImg ? 'w-6 bg-neon-purple shadow-neon-purple' : 'w-2 bg-white/30'"
                :aria-label="`تصویر ${i + 1}`"
                @click="activeImg = i"
              />
            </div>

            <!-- راهنمای لمس برای زوم -->
            <span class="absolute bottom-4 end-4 z-10 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-bold text-zinc-300 backdrop-blur-md">
              🔍 کلیک برای زوم
            </span>
          </div>

          <!-- بندانگشتی‌های گالری -->
          <div class="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              v-for="(img, i) in product.images"
              :key="i"
              class="h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-[#12121c] p-1.5 transition-all duration-200"
              :class="i === activeImg ? 'border-neon-purple shadow-neon-purple scale-105' : 'border-white/10 opacity-60 hover:opacity-100'"
              @click="activeImg = i"
            >
              <img :src="img" :alt="`بندانگشتی ${i + 1}`" class="h-full w-full object-contain" loading="lazy" />
            </button>
          </div>
        </div>

        <!-- ستون مشخصات و گزینه‌ها -->
        <div class="lg:col-span-6 space-y-5">
          <!-- اطلاعات اولیه: عنوان، قیمت، امتیاز -->
          <div class="glass rounded-[2rem] p-5 sm:p-6 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-neon-purple uppercase tracking-wider">{{ product.brand }}</span>
              <span class="flex items-center gap-1 text-xs font-bold text-neon-green">
                <span class="h-2 w-2 animate-pulse rounded-full bg-neon-green" />
                موجود در انبار لوکس ویپ
              </span>
            </div>

            <h1 class="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-snug">
              {{ product.name }}
            </h1>
            <p class="text-xs font-mono text-zinc-400" dir="ltr">{{ product.nameEn }}</p>

            <!-- تگ لاین -->
            <p class="text-xs sm:text-sm font-bold text-neon-ice leading-relaxed">
              ✨ {{ product.tagline }}
            </p>

            <!-- امتیاز و نظرات -->
            <div class="flex items-center gap-3 border-y border-white/10 py-3">
              <div class="flex items-center gap-1 text-xs font-black text-amber-400">
                <span>⭐</span>
                <span>{{ toFa(product.rating) }}</span>
              </div>
              <span class="text-xs text-zinc-400">({{ toFa(product.reviews) }} نظر ثبت‌شده خریداران)</span>
            </div>

            <!-- قیمت -->
            <div class="flex items-end gap-3 pt-1">
              <div>
                <p class="text-xs text-zinc-400 font-bold mb-0.5">قیمت ویژه:</p>
                <p class="text-2xl sm:text-3xl font-black text-neon-green tracking-tight">
                  {{ formatPrice(product.price) }}
                </p>
              </div>
              <p v-if="product.oldPrice" class="pb-1 text-sm font-medium text-zinc-400 line-through">
                {{ formatPrice(product.oldPrice) }}
              </p>
            </div>
          </div>

          <!-- انتخاب طعم و رنگ -->
          <div class="glass rounded-[2rem] p-5 sm:p-6 space-y-3">
            <div class="flex items-center justify-between">
              <h2 class="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>🎨</span>
                <span>انتخاب طعم / رنگ</span>
              </h2>
              <IceMeter :level="selectedFlavor?.cooling ?? 0" />
            </div>

            <div class="grid grid-cols-2 gap-2.5">
              <button
                v-for="f in product.flavors"
                :key="f.id"
                class="flex items-center gap-2.5 rounded-2xl border-2 p-3 text-start transition-all duration-200 active:scale-95"
                :class="selectedFlavorId === f.id ? 'border-neon-purple bg-neon-purple/20 shadow-neon-purple' : 'border-white/10 bg-white/[0.04] hover:border-white/20'"
                @click="selectedFlavorId = f.id"
              >
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl shadow-sm" :style="{ background: f.color + '44' }">
                  {{ f.icon }}
                </span>
                <div class="min-w-0 flex-1">
                  <span class="block truncate text-xs font-black text-white">{{ f.name }}</span>
                  <span class="block text-[10px] font-bold text-neon-ice">❄ خنکی: {{ toFa(f.cooling) }}/۵</span>
                </div>
              </button>
            </div>
          </div>

          <!-- انتخاب میزان نیکوتین -->
          <div class="glass rounded-[2rem] p-5 sm:p-6 space-y-3">
            <h2 class="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>🧪</span>
              <span>میزان نیکوتین</span>
            </h2>

            <div class="flex gap-2">
              <button
                v-for="n in product.nicotine"
                :key="n"
                class="flex-1 rounded-2xl border-2 py-3 text-center text-sm font-black transition-all duration-200 active:scale-95"
                :class="selectedNicotine === n ? 'border-neon-green bg-neon-green/20 text-neon-green shadow-neon-green' : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/20'"
                @click="selectedNicotine = n"
              >
                <span dir="ltr">{{ n }}mg</span>
              </button>
            </div>

            <!-- راهنمای سطح نیکوتین انتخابی -->
            <div v-if="nicGuide" class="rounded-2xl border border-neon-ice/30 bg-neon-ice/10 p-3.5 text-xs leading-relaxed text-zinc-200">
              <span class="font-black text-neon-ice">راهنما: {{ nicGuide.label }} (سطح {{ nicGuide.level }})</span>
              — {{ nicGuide.desc }}
            </div>
          </div>

          <!-- پروفایل طعم (Sweetness, Cooling, Throat Hit) -->
          <div class="glass rounded-[2rem] p-5 sm:p-6 space-y-3">
            <h2 class="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>📊</span>
              <span>پروفایل و مشخصات طعم</span>
            </h2>
            <FlavorProfileBars :profile="product.profile" />
          </div>

          <!-- مشخصات فنی دستگاه -->
          <div class="glass rounded-[2rem] p-5 sm:p-6 space-y-3">
            <h2 class="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>⚙️</span>
              <span>مشخصات فنی و سخت‌افزاری</span>
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div
                v-for="s in specRows"
                :key="s.label"
                class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3"
              >
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-lg">{{ s.icon }}</span>
                <div>
                  <p class="text-[11px] font-bold text-zinc-400">{{ s.label }}</p>
                  <p class="text-xs font-black text-white mt-0.5">{{ s.value }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- اقلام سازگار پیشنهادی -->
          <div v-if="compatible.length > 0" class="rounded-[2rem] border border-neon-amber/35 bg-neon-amber/[0.08] p-5 sm:p-6 space-y-3">
            <h3 class="text-sm sm:text-base font-black text-neon-amber flex items-center gap-2">
              <span>⚠️</span>
              <span>اقلام و کویل‌های کاملاً سازگار</span>
            </h3>
            <p class="text-xs leading-relaxed text-zinc-300">این اقلام با «{{ product.name }}» آزمایش شده و پیشنهاد می‌شوند:</p>

            <div class="space-y-2.5 pt-1">
              <div
                v-for="c in compatible"
                :key="c.id"
                class="glass flex items-center gap-3 rounded-2xl p-3"
              >
                <NuxtLink :to="`/products/${c.id}`" class="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#14141e] p-1">
                  <img :src="c.images[0]" :alt="c.name" class="h-full w-full object-contain" loading="lazy" />
                </NuxtLink>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-xs font-black text-white">{{ c.name }}</p>
                  <p class="text-xs font-black text-neon-green mt-0.5">{{ formatPrice(c.price) }}</p>
                </div>
                <button
                  class="rounded-xl bg-neon-green/20 border border-neon-green/40 px-3.5 py-2 text-xs font-black text-neon-green transition hover:bg-neon-green/30 active:scale-90"
                  @click="cart.add(c.id, c.flavors[0]?.id, c.nicotine.includes(0) ? undefined : c.nicotine[0], 1)"
                >
                  ＋ افزودن
                </button>
              </div>
            </div>
          </div>

          <!-- توضیحات کامل محصول -->
          <div class="glass rounded-[2rem] p-5 sm:p-6 space-y-2">
            <h3 class="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>📝</span>
              <span>توضیحات و نقد و بررسی</span>
            </h3>
            <p class="text-xs sm:text-sm leading-relaxed text-zinc-300 pt-1">
              {{ product.description }}
            </p>
          </div>

          <!-- بنر مشاوره با دستیار AI -->
          <button
            class="flex w-full items-center gap-4 rounded-[2rem] border border-neon-purple/40 bg-gradient-to-l from-neon-purple/25 via-[#12121c] to-neon-ice/15 p-5 text-start transition-all hover:shadow-neon-purple active:scale-[0.98]"
            @click="assistantOpen = true"
          >
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-violet to-neon-ice text-2xl shadow-neon-purple">
              ✨
            </span>
            <div>
              <span class="block text-sm font-black text-white">برای انتخاب طعم و نیکوتین تردید داری؟</span>
              <span class="block text-xs text-zinc-300 mt-0.5">از ساملیه (دستیار هوشمند طعم) رایگان مشاوره بگیر!</span>
            </div>
          </button>
        </div>
      </div>

      <!-- محصولات مرتبط -->
      <section class="mt-10 space-y-4">
        <h2 class="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <span>🔗</span>
          <span>محصولات مرتبط و پیشنهادی</span>
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <ProductCard
            v-for="(r, i) in related"
            :key="r.id"
            :product="r"
            :index="i"
          />
        </div>
      </section>

      <!-- فضای جبرانی برای اکشن‌بار ثابت پایین -->
      <div class="h-28" />

      <!-- ===== اکشن‌بار خرید ثابت چسبان (Sticky Action Bar) ===== -->
      <div class="fixed inset-x-0 bottom-0 z-[60] mx-auto w-full max-w-2xl px-4 pb-[max(env(safe-area-inset-bottom),0.8rem)]">
        <div class="glass-strong rounded-3xl p-3 shadow-glass border border-white/[0.2]">
          <div class="flex items-center gap-3">
            <!-- استپر تعداد -->
            <div class="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-1.5">
              <button
                class="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-base font-black text-white transition active:scale-90 hover:bg-white/20"
                aria-label="کاهش تعداد"
                @click="qty = Math.max(1, qty - 1)"
              >
                −
              </button>
              <span class="min-w-[1.5rem] text-center text-sm font-black text-white">{{ toFa(qty) }}</span>
              <button
                class="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-base font-black text-white transition active:scale-90 hover:bg-white/20"
                aria-label="افزایش تعداد"
                @click="qty = Math.min(99, qty + 1)"
              >
                ＋
              </button>
            </div>

            <!-- دکمه افزودن به سبد خرید -->
            <button
              class="btn-neon flex-1 !py-3.5 !text-sm flex items-center justify-center gap-2"
              @click="addToCart"
            >
              <span v-if="!added">🛒 افزودن به سبد • {{ formatPrice(product.price * qty) }}</span>
              <span v-else class="text-neon-green font-black">✓ به سبد خرید اضافه شد!</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ===== مودال زوم تمام‌صفحه تصویر ===== -->
      <Teleport to="body">
        <Transition name="fade">
          <div
            v-if="zoom"
            class="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
            @click="zoom = false"
          >
            <img
              :src="product.images[activeImg]"
              :alt="product.name"
              class="max-h-[85vh] max-w-[90vw] object-contain drop-shadow-[0_0_50px_rgba(168,85,247,0.5)]"
            />
            <span class="absolute bottom-8 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-bold text-white backdrop-blur-md">
              👆 برای بستن هر نقطه را لمس کنید
            </span>
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

const id = computed(() => route.params.id as string)
const product = computed(() => getProduct(id.value))
const related = computed(() => relatedProducts(id.value, 4))
const compatible = computed(() =>
  (product.value?.compatibleWith ?? [])
    .map((cid) => getProduct(cid))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[],
)

useHead(() => ({ title: product.value ? product.value.name : 'محصول' }))

// انتخاب‌های کاربر
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
    { icon: '🌀', label: 'کویل و مقاومت', value: s.coil },
    { icon: '🧪', label: 'ظرفیت مخزن', value: s.tank },
    { icon: '🔌', label: 'درگاه شارژ', value: s.charging },
    { icon: '🌬️', label: 'تنظیم ایرفلو', value: s.airflow },
  ]
  if (s.power) rows.push({ icon: '⚡', label: 'توان خروجی', value: s.power })
  if (s.display) rows.push({ icon: '📟', label: 'نمایشگر', value: s.display })
  if (s.weight) rows.push({ icon: '⚖️', label: 'وزن دستگاه', value: s.weight })
  return rows.filter((r) => r.value && r.value !== '—')
})

// گالری
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

const toFa = (n: number): string =>
  n.toLocaleString('fa-IR', { maximumFractionDigits: 1 })

function addToCart() {
  if (!product.value) return
  cart.add(product.value.id, selectedFlavorId.value || undefined, selectedNicotine.value, qty.value)
  added.value = true
  setTimeout(() => (added.value = false), 1800)
}

async function share() {
  if (!product.value) return
  const url = window.location.href
  try {
    if (navigator.share) {
      await navigator.share({ title: product.value.name, url })
    } else {
      await navigator.clipboard.writeText(url)
      cart.notify('لینک صفحه کپی شد 📋')
    }
  } catch {
    /* ignore */
  }
}
</script>
