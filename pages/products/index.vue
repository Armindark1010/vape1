<template>
  <div class="pt-4">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-black">🛍️ فروشگاه</h1>
      <button class="chip" @click="filterOpen = true">
        🎚️ فیلتر
        <span v-if="hasFilter" class="flex h-4 w-4 items-center justify-center rounded-full bg-neon-purple text-[9px]">•</span>
      </button>
    </div>

    <!-- جستجو -->
    <div class="relative mt-3">
      <input
        v-model="q"
        type="search"
        placeholder="جستجوی محصول، برند یا طعم..."
        class="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-3 pe-4 ps-11 text-[13px] backdrop-blur-md placeholder:text-zinc-500 focus:border-neon-purple/60 focus:outline-none"
      />
      <span class="absolute start-3.5 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
    </div>

    <!-- دسته‌ها -->
    <div class="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button
        class="chip"
        :class="!cat ? 'chip-active' : ''"
        @click="cat = ''"
      >
        همه
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

    <p class="mt-2 text-[11px] text-zinc-500">{{ toFa(filtered.length) }} محصول پیدا شد</p>

    <!-- گرید -->
    <div v-if="filtered.length > 0" class="mt-2 grid grid-cols-2 gap-2.5">
      <ProductCard v-for="(p, i) in filtered" :key="p.id" :product="p" :index="i" />
    </div>
    <div v-else class="flex flex-col items-center py-16 text-center">
      <span class="text-5xl">😶‍🌫️</span>
      <p class="mt-3 text-sm font-extrabold">چیزی پیدا نشد!</p>
      <p class="mt-1 text-xs text-zinc-400">فیلترها رو عوض کن یا از AI کمک بگیر ✨</p>
      <div class="mt-4 flex gap-2">
        <button class="chip" @click="resetFilters">حذف فیلترها</button>
        <button class="chip chip-active" @click="assistantOpen = true">✨ مشاوره AI</button>
      </div>
    </div>

    <!-- ===== شیت فیلتر ===== -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="filterOpen" class="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm" @click="filterOpen = false" />
      </Transition>
      <Transition name="sheet">
        <div
          v-if="filterOpen"
          class="glass-strong fixed inset-x-0 bottom-0 z-[71] mx-auto w-full max-w-md rounded-t-3xl p-4 safe-bottom"
        >
          <div class="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/20" />
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-black">🎚️ فیلتر محصولات</p>
            <button class="text-[11px] font-bold text-neon-pink" @click="resetFilters">حذف همه</button>
          </div>

          <p class="mb-2 text-xs font-extrabold text-zinc-300">دسته‌بندی</p>
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

          <p class="mb-2 mt-4 text-xs font-extrabold text-zinc-300">نیکوتین</p>
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

          <p class="mb-2 mt-4 text-xs font-extrabold text-zinc-300">مرتب‌سازی</p>
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

          <button class="btn-neon mt-5 w-full" @click="filterOpen = false">
            نمایش {{ toFa(filtered.length) }} محصول
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { CATEGORIES } from '~/types/product'
import { PRODUCTS } from '~/data/products'

useHead({ title: 'فروشگاه' })

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
  { id: 'popular', label: '⭐ محبوب‌ترین' },
  { id: 'cheap', label: '💰 ارزون‌ترین' },
  { id: 'expensive', label: '💎 گرون‌ترین' },
  { id: 'rating', label: '🏆 بالاترین امتیاز' },
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
