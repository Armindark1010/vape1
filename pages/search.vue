<template>
  <div class="pt-4">
    <h1 class="text-lg font-black">🔍 جستجو</h1>

    <div class="relative mt-3">
      <input
        ref="inputRef"
        v-model="q"
        type="search"
        placeholder="دنبال چی می‌گردی؟ (مثلاً: انبه یخ)"
        class="w-full rounded-2xl border border-neon-purple/40 bg-white/[0.06] py-3.5 pe-4 ps-11 text-sm shadow-neon-purple backdrop-blur-md placeholder:text-zinc-500 focus:outline-none"
      />
      <span class="absolute start-3.5 top-1/2 -translate-y-1/2">🔍</span>
    </div>

    <!-- جستجوهای پرتکرار -->
    <div v-if="!q.trim()" class="mt-4">
      <p class="mb-2 text-xs font-extrabold text-zinc-400">🔥 پرتکرارها</p>
      <div class="flex flex-wrap gap-2">
        <button v-for="t in trending" :key="t" class="chip" @click="q = t">{{ t }}</button>
      </div>

      <button
        class="mt-4 flex w-full items-center gap-3 rounded-3xl border border-neon-purple/30 bg-gradient-to-l from-neon-purple/15 to-neon-ice/10 p-4 text-start transition active:scale-[0.98]"
        @click="assistantOpen = true"
      >
        <span class="text-2xl">✨</span>
        <span>
          <span class="block text-[13px] font-black">نمی‌دونی چی می‌خوای؟</span>
          <span class="block text-[11px] text-zinc-400">بذار AI بر اساس ذائقه‌ات پیشنهاد بده</span>
        </span>
      </button>
    </div>

    <!-- نتایج -->
    <div v-else class="mt-4">
      <p class="text-[11px] text-zinc-500">{{ toFa(results.length) }} نتیجه برای «{{ q }}»</p>
      <div v-if="results.length > 0" class="mt-2 grid grid-cols-2 gap-2.5">
        <ProductCard v-for="(p, i) in results" :key="p.id" :product="p" :index="i" />
      </div>
      <div v-else class="flex flex-col items-center py-14 text-center">
        <span class="text-5xl">😶‍🌫️</span>
        <p class="mt-3 text-sm font-extrabold">نتیجه‌ای پیدا نشد</p>
        <button class="chip chip-active mt-3" @click="assistantOpen = true">✨ کمک از دستیار AI</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PRODUCTS } from '~/data/products'

useHead({ title: 'جستجو' })

const assistantOpen = useState<boolean>('assistantOpen', () => false)
const q = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const trending = ['انبه یخ 🥭', 'نعناع ❄️', 'یکبارمصرف ⚡', 'تنباکو 🍂', 'پاد 🔋', 'کویل 🌀']

const results = computed(() => {
  const query = q.value.trim().toLowerCase()
  if (!query) return []
  return PRODUCTS.filter((p) =>
    [p.name, p.nameEn, p.brand, p.tagline, p.description, ...p.flavors.map((f) => f.name), ...p.tags]
      .join(' ')
      .toLowerCase()
      .includes(query.replace(/[🍓🥭❄️⚡🍂🔋🌀]/g, '').trim()),
  )
})

const toFa = (n: number): string => n.toLocaleString('fa-IR')

onMounted(() => {
  setTimeout(() => inputRef.value?.focus({ preventScroll: true }), 350)
})
</script>
