<template>
  <header class="glass-strong sticky top-0 z-50 border-x-0 border-t-0">
    <div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
      <!-- برند و لوگو -->
      <NuxtLink to="/" class="group flex items-center gap-3">
        <span
          class="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-violet via-neon-purple to-neon-ice text-xl sm:text-2xl shadow-neon-purple transition-transform duration-300 group-hover:scale-105"
        >
          💨
        </span>
        <div class="leading-tight">
          <div class="flex items-center gap-1.5">
            <span class="neon-text-purple text-base sm:text-lg font-black tracking-tight">لوکس ویپ</span>
            <span class="hidden sm:inline-block rounded-full bg-neon-purple/20 px-2 py-0.5 text-[9px] font-black text-neon-purple border border-neon-purple/30">PREMIUM</span>
          </div>
          <span class="block text-[10px] font-extrabold text-zinc-400 tracking-wider">VAPE • SALT • POD</span>
        </div>
      </NuxtLink>

      <!-- منوی دسته‌بندی‌ها در دسکتاپ -->
      <nav class="hidden lg:flex items-center gap-1">
        <NuxtLink
          to="/products"
          class="rounded-xl px-3 py-2 text-xs font-bold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
          :class="route.path === '/products' && !route.query.cat ? 'text-neon-purple font-black bg-neon-purple/10' : ''"
        >
          🛍️ همه محصولات
        </NuxtLink>
        <NuxtLink
          v-for="c in CATEGORIES"
          :key="c.id"
          :to="`/products?cat=${c.id}`"
          class="rounded-xl px-3 py-2 text-xs font-bold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
          :class="route.query.cat === c.id ? 'text-neon-purple font-black bg-neon-purple/10' : ''"
        >
          {{ c.icon }} {{ c.label }}
        </NuxtLink>
      </nav>

      <!-- نوار جستجو در دسکتاپ و تبلت -->
      <div class="hidden md:flex relative flex-1 max-w-xs mx-2">
        <input
          v-model="desktopSearch"
          type="search"
          placeholder="جستجوی پاد، سالت، طعم..."
          class="w-full rounded-2xl border border-white/10 bg-[#12121c]/90 py-2 pe-4 ps-10 text-xs text-white placeholder:text-zinc-500 focus:border-neon-purple/70 focus:outline-none focus:ring-1 focus:ring-neon-purple/50 transition-all"
          @keydown.enter="onDesktopSearch"
        />
        <span class="absolute start-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">🔍</span>
      </div>

      <!-- دکمه‌های اکشن (مشاوره AI، جستجو، سبد خرید، پروفایل) -->
      <div class="flex items-center gap-2">
        <!-- دکمه دستیار هوشمند در دسکتاپ -->
        <button
          class="hidden sm:inline-flex items-center gap-1.5 rounded-2xl border border-neon-purple/40 bg-neon-purple/15 px-3.5 py-2 text-xs font-black text-white shadow-neon-purple transition hover:bg-neon-purple/25 active:scale-95"
          @click="assistantOpen = true"
        >
          <span class="text-sm">✨</span>
          <span>مشاوره طعم با AI</span>
        </button>

        <!-- آیکون جستجو در موبایل -->
        <NuxtLink
          to="/search"
          class="md:hidden rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 text-zinc-300 transition hover:text-white active:scale-90"
          aria-label="جستجو"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path stroke-linecap="round" d="M16.5 16.5L21 21" />
          </svg>
        </NuxtLink>

        <!-- سبد خرید -->
        <button
          class="relative flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-zinc-200 transition hover:border-white/25 hover:text-white active:scale-90"
          aria-label="سبد خرید"
          @click="cartOpen = true"
        >
          <div class="relative">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h2l2.4 12.2A1 1 0 0 0 8.4 17H19a1 1 0 0 0 1-1L21.5 8H6" />
              <circle cx="9.5" cy="20" r="1.4" />
              <circle cx="17.5" cy="20" r="1.4" />
            </svg>
            <Transition name="pop">
              <span
                v-if="cart.count > 0"
                class="absolute -end-2 -top-2 flex h-4 min-w-[1.1rem] items-center justify-center rounded-full bg-neon-green px-1 text-[9px] font-black text-vapor-950 shadow-neon-green"
              >
                {{ cart.count.toLocaleString('fa-IR') }}
              </span>
            </Transition>
          </div>
          <!-- پیش‌نمایش مبلغ در دسکتاپ -->
          <span v-if="cart.count > 0" class="hidden sm:inline-block text-xs font-black text-neon-green">
            {{ formatPrice(cart.subtotal) }}
          </span>
        </button>

        <!-- لینک پروفایل در دسکتاپ -->
        <NuxtLink
          to="/profile"
          class="hidden sm:flex rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 text-zinc-300 transition hover:text-white hover:border-white/25 active:scale-90"
          aria-label="پروفایل"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path stroke-linecap="round" d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { CATEGORIES, formatPrice } from '~/types/product'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const cartOpen = useState<boolean>('cartOpen', () => false)
const assistantOpen = useState<boolean>('assistantOpen', () => false)

const desktopSearch = ref('')

function onDesktopSearch() {
  const q = desktopSearch.value.trim()
  if (q) {
    router.push({ path: '/products', query: { q } })
    desktopSearch.value = ''
  }
}
</script>
