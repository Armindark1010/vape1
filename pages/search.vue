<template>
  <div class="space-y-6 pt-4 sm:pt-6 max-w-4xl mx-auto">
    <div>
      <h1 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
        <span>🔍</span>
        <span>جستجوی هوشمند در فروشگاه</span>
      </h1>
      <p class="text-xs text-zinc-400 mt-1">پیدا کردن سریع پاد، سالت، کویل و طعم‌های دلخواه</p>
    </div>

    <!-- ورودی جستجو -->
    <div class="relative">
      <input
        ref="inputRef"
        v-model="q"
        type="search"
        placeholder="نام محصول، برند یا طعم دلخواهت رو بنویس (مثلاً: انبه یخ، پاد، نعناع)..."
        class="w-full rounded-2xl border border-neon-purple/50 bg-[#101018] py-4 pe-4 ps-12 text-sm sm:text-base text-white shadow-neon-purple backdrop-blur-xl placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-neon-purple/60 transition-all"
      />
      <span class="absolute start-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
    </div>

    <!-- بخش جستجوهای پرطرفدار -->
    <div v-if="!q.trim()" class="glass rounded-3xl p-5 sm:p-6 space-y-4">
      <div>
        <p class="text-xs font-black text-neon-ice flex items-center gap-1.5">
          <span>🔥</span>
          <span>طعم‌ها و محصولات پرتکرار</span>
        </p>
        <p class="text-[11px] text-zinc-400 mt-0.5">برای جستجوی سریع روی هر عبارت کلیک کنید:</p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="t in trending"
          :key="t"
          class="chip !py-2.5 !px-4 hover:border-neon-purple/60 hover:text-white"
          @click="q = t"
        >
          {{ t }}
        </button>
      </div>

      <!-- بنر راهنمایی AI -->
      <button
        class="mt-4 flex w-full items-center gap-4 rounded-2xl border border-neon-purple/40 bg-gradient-to-l from-neon-purple/20 via-[#12121c] to-neon-ice/15 p-4 text-start transition hover:shadow-neon-purple active:scale-[0.98]"
        @click="assistantOpen = true"
      >
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-violet to-neon-ice text-xl shadow-neon-purple">
          ✨
        </span>
        <div>
          <span class="block text-xs sm:text-sm font-black text-white">نمی‌دونی دقیقاً چی انتخاب کنی؟</span>
          <span class="block text-[11px] text-zinc-300 mt-0.5">بذار ساملیه (دستیار AI) با چند سوال بهترین طعم رو بهت پیشنهاد بده!</span>
        </div>
      </button>
    </div>

    <!-- نتایج جستجو -->
    <div v-else class="space-y-4">
      <div class="flex items-center justify-between">
        <p class="text-xs text-zinc-300">
          نمایش <span class="font-black text-neon-green">{{ toFa(results.length) }}</span> نتیجه برای «{{ q }}»
        </p>
        <button class="text-xs font-bold text-neon-pink" @click="q = ''">پاک کردن ✕</button>
      </div>

      <div v-if="results.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <ProductCard v-for="(p, i) in results" :key="p.id" :product="p" :index="i" />
      </div>

      <div v-else class="glass flex flex-col items-center py-16 px-4 text-center rounded-3xl space-y-3">
        <span class="text-6xl">😶‍🌫️</span>
        <h3 class="text-base font-black text-white">محصولی با این نام پیدا نشد!</h3>
        <p class="text-xs text-zinc-400 max-w-sm">
          می‌توانید کلمه دیگری را جستجو کنید یا از ساملیه کمک بگیرید ✨
        </p>
        <button class="btn-neon !text-xs !py-2.5 !px-5 mt-2" @click="assistantOpen = true">
          ✨ راهنمایی با دستیار هوشمند
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PRODUCTS } from '~/data/products'

useHead({ title: 'جستجوی هوشمند کالاها' })

const assistantOpen = useState<boolean>('assistantOpen', () => false)
const q = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const trending = ['انبه یخ 🥭', 'نعناع یخی ❄️', 'پاد لوکس 🔋', 'یکبارمصرف ۵۰۰۰ ⚡', 'تنباکوی طلایی 🍂', 'کویل مش 🌀', 'سالت بری 🫐']

const results = computed(() => {
  const query = q.value.trim().toLowerCase()
  if (!query) return []
  return PRODUCTS.filter((p) =>
    [p.name, p.nameEn, p.brand, p.tagline, p.description, ...p.flavors.map((f) => f.name), ...p.tags]
      .join(' ')
      .toLowerCase()
      .includes(query.replace(/[🍓🥭❄️⚡🍂🔋🌀🫐]/g, '').trim()),
  )
})

const toFa = (n: number): string => n.toLocaleString('fa-IR')

onMounted(() => {
  setTimeout(() => inputRef.value?.focus({ preventScroll: true }), 300)
})
</script>
