<template>
  <div class="space-y-6 pt-4 sm:pt-6">
    <!-- هدر صفحه فروشگاه و اکشن‌ها -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>🛍️</span>
          <span>فروشگاه تخصصی ویپ و سالت</span>
        </h1>
        <p class="text-xs text-zinc-400 mt-1">
          نمایش <span class="font-bold text-neon-green">{{ toFa(filtered.length) }}</span> محصول اورجینال
        </p>
      </div>

      <!-- دکمه باز کردن فیلتر در موبایل -->
      <div class="flex items-center gap-2">
        <button
          class="sm:hidden chip !py-2.5 flex-1 justify-center"
          :class="hasFilter ? 'chip-active' : ''"
          @click="filterOpen = true"
        >
          <span>🎚️ فیلتر پیشرفته</span>
          <span v-if="hasFilter" class="h-2 w-2 rounded-full bg-neon-purple" />
        </button>

        <button
          v-if="hasFilter"
          class="chip text-neon-pink hover:border-neon-pink/40 !py-2.5"
          @click="resetFilters"
        >
          ✕ حذف فیلترها
        </button>
      </div>
    </div>

    <!-- نوار جستجو و فیلترهای سریع دسکتاپ/موبایل -->
    <div class="glass rounded-2xl p-4 space-y-4">
      <!-- ورودی جستجوی زنده -->
      <div class="relative">
        <input
          v-model="q"
          type="search"
          placeholder="جستجوی نام محصول، برند، طعم (مثلاً: انبه یخ، پاد، نعناع)..."
          class="w-full rounded-2xl border border-white/10 bg-[#12121c]/90 py-3 pe-4 ps-11 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:border-neon-purple/70 focus:outline-none focus:ring-1 focus:ring-neon-purple/50 transition-all"
        />
        <span class="absolute start-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">🔍</span>
      </div>

      <!-- دسته‌بندی‌ها -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          class="chip"
          :class="!cat ? 'chip-active' : ''"
          @click="cat = ''"
        >
          همه دسته‌ها
        </button>
        <button
          v-for="c in CATEGORIES"
          :key="c.id"
          class="chip"
          :class="cat === c.id ? 'chip-active' : ''"
          @click="cat = c.id"
        >
          {{ c.icon }} {{ c.label }}
        </button>
      </div>

      <!-- فیلترهای نیکوتین و مرتب‌سازی در دسکتاپ -->
      <div class="hidden sm:flex items-center justify-between gap-4 border-t border-white/10 pt-3 text-xs">
        <!-- نیکوتین -->
        <div class="flex items-center gap-2">
          <span class="font-bold text-zinc-400">میزان نیکوتین:</span>
          <button class="chip !py-1 !px-3" :class="nic === null ? 'chip-active' : ''" @click="nic = null">همه</button>
          <button
            v-for="n in [0, 20, 30, 50]"
            :key="n"
            class="chip !py-1 !px-3"
            :class="nic === n ? 'chip-active' : ''"
            @click="nic = n"
          >
            <span dir="ltr">{{ n }}mg</span>
          </button>
        </div>

        <!-- مرتب‌سازی -->
        <div class="flex items-center gap-2">
          <span class="font-bold text-zinc-400">مرتب‌سازی:</span>
          <select
            v-model="sort"
            class="rounded-xl border border-white/10 bg-[#14141e] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neon-purple/60"
          >
            <option v-for="s in sorts" :key="s.id" :value="s.id">{{ s.label }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- گرید محصولات -->
    <div v-if="filtered.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      <ProductCard
        v-for="(p, i) in filtered"
        :key="p.id"
        :product="p"
        :index="i"
      />
    </div>

    <!-- حالت نتیجه نیافتن -->
    <div v-else class="glass flex flex-col items-center py-16 px-4 text-center rounded-3xl">
      <span class="text-6xl">😶‍🌫️</span>
      <h3 class="mt-4 text-base sm:text-lg font-black text-white">محصولی با این مشخصات پیدا نشد!</h3>
      <p class="mt-1 text-xs sm:text-sm text-zinc-400 max-w-sm">
        فیلترها را تغییر دهید یا از ساملیه (دستیار هوشمند طعم) برای پیشنهاد کمک بگیرید ✨
      </p>
      <div class="mt-5 flex flex-wrap gap-2 justify-center">
        <button class="chip" @click="resetFilters">حذف همه فیلترها</button>
        <button class="btn-neon !text-xs !py-2.5 !px-5" @click="assistantOpen = true">✨ مشاوره با هوش مصنوعی</button>
      </div>
    </div>

    <!-- ===== شیت فیلتر موبایل ===== -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="filterOpen" class="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm" @click="filterOpen = false" />
      </Transition>
      <Transition name="sheet">
        <div
          v-if="filterOpen"
          class="glass-strong fixed inset-x-0 bottom-0 z-[71] mx-auto w-full max-w-lg rounded-t-3xl p-5 safe-bottom space-y-4"
        >
          <div class="mx-auto mb-2 h-1.5 w-12 rounded-full bg-white/20" />
          
          <div class="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 class="text-sm font-black text-white flex items-center gap-2">
              <span>🎚️</span>
              <span>فیلتر محصولات</span>
            </h3>
            <button class="text-xs font-bold text-neon-pink" @click="resetFilters">حذف همه</button>
          </div>

          <!-- دسته‌بندی -->
          <div>
            <p class="mb-2 text-xs font-black text-zinc-300">دسته‌بندی کالا</p>
            <div class="flex flex-wrap gap-2">
              <button class="chip" :class="!cat ? 'chip-active' : ''" @click="cat = ''">همه</button>
              <button
                v-for="c in CATEGORIES"
                :key="c.id"
                class="chip"
                :class="cat === c.id ? 'chip-active' : ''"
                @click="cat = c.id"
              >
                {{ c.icon }} {{ c.label }}
              </button>
            </div>
          </div>

          <!-- میزان نیکوتین -->
          <div>
            <p class="mb-2 text-xs font-black text-zinc-300">میزان نیکوتین</p>
            <div class="flex flex-wrap gap-2">
              <button class="chip" :class="nic === null ? 'chip-active' : ''" @click="nic = null">همه</button>
              <button
                v-for="n in [0, 20, 30, 50]"
                :key="n"
                class="chip"
                :class="nic === n ? 'chip-active' : ''"
                @click="nic = n"
              >
                <span dir="ltr">{{ n }}mg</span>
              </button>
            </div>
          </div>

          <!-- مرتب‌سازی -->
          <div>
            <p class="mb-2 text-xs font-black text-zinc-300">مرتب‌سازی بر اساس</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="s in sorts"
                :key="s.id"
                class="chip"
                :class="sort === s.id ? 'chip-active' : ''"
                @click="sort = s.id"
              >
                {{ s.label }}
              </button>
            </div>
          </div>

          <button class="btn-neon mt-4 w-full !py-3.5" @click="filterOpen = false">
            مشاهده {{ toFa(filtered.length) }} محصول
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { CATEGORIES } from '~/types/product'
import { PRODUCTS } from '~/data/products'

useHead({ title: 'فروشگاه تخصصی ویپ و سالت' })

const route = useRoute()
const assistantOpen = useState<boolean>('assistantOpen', () => false)

const q = ref((route.query.q as string) ?? '')
const cat = ref((route.query.cat as string) ?? '')
const nic = ref<number | null>(null)
const sort = ref('popular')
const filterOpen = ref(false)

watch(
  () => route.query,
  (query) => {
    if (query.cat !== undefined) cat.value = (query.cat as string) ?? ''
    if (query.q !== undefined) q.value = (query.q as string) ?? ''
  },
)

const sorts = [
  { id: 'popular', label: '⭐ پرفروش‌ترین و محبوب‌ترین' },
  { id: 'cheap', label: '💰 ارزان‌ترین' },
  { id: 'expensive', label: '💎 گران‌ترین' },
  { id: 'rating', label: '🏆 بالاترین امتیاز رضایت' },
]

const hasFilter = computed(() => !!cat.value || nic.value !== null || sort.value !== 'popular' || !!q.value)

const filtered = computed(() => {
  let list = [...PRODUCTS]
  if (cat.value) list = list.filter((p) => p.category === cat.value)
  if (nic.value !== null) list = list.filter((p) => p.nicotine.includes(nic.value!))
  const query = q.value.trim().toLowerCase()
  if (query) {
    list = list.filter((p) =>
      [p.name, p.nameEn, p.brand, p.tagline, ...p.flavors.map((f) => f.name)]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }
  switch (sort.value) {
    case 'cheap':
      list.sort((a, b) => a.price - b.price)
      break
    case 'expensive':
      list.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      list.sort((a, b) => b.rating - a.rating)
      break
    default:
      list.sort((a, b) => b.reviews * b.rating - a.reviews * a.rating)
  }
  return list
})

function resetFilters() {
  cat.value = ''
  nic.value = null
  sort.value = 'popular'
  q.value = ''
}

const toFa = (n: number): string => n.toLocaleString('fa-IR')
</script>
