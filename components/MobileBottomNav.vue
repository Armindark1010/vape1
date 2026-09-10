<template>
  <nav
    v-if="!hidden"
    class="fixed inset-x-0 bottom-0 z-[60] mx-auto w-full max-w-md px-3 pb-[max(env(safe-area-inset-bottom),0.6rem)]"
  >
    <div
      class="glass-strong relative flex items-end justify-between rounded-3xl px-2 pb-2 pt-2 shadow-glass"
    >
      <!-- خانه -->
      <NuxtLink
        to="/"
        class="flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[10px] font-bold transition"
        :class="isActive('/') ? 'text-neon-purple' : 'text-zinc-400'"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 10.5L12 3l9 7.5V21H3z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 21v-6h6v6" />
        </svg>
        خانه
      </NuxtLink>

      <!-- جستجو -->
      <NuxtLink
        to="/search"
        class="flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[10px] font-bold transition"
        :class="isActive('/search') ? 'text-neon-purple' : 'text-zinc-400'"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path stroke-linecap="round" d="M16.5 16.5L21 21" />
        </svg>
        جستجو
      </NuxtLink>

      <!-- دکمه مرکزی دستیار AI -->
      <div class="relative -top-5 flex flex-1 flex-col items-center">
        <button
          class="flex h-16 w-16 animate-pulse-glow items-center justify-center rounded-full bg-gradient-to-br from-neon-purple via-neon-violet to-neon-blue text-2xl text-white transition active:scale-90"
          aria-label="دستیار هوشمند"
          @click="assistantOpen = true"
        >
          ✨
        </button>
        <span class="-mt-1 text-[10px] font-black text-neon-purple">دستیار AI</span>
      </div>

      <!-- سبد خرید -->
      <button
        class="relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[10px] font-bold text-zinc-400 transition"
        @click="cartOpen = true"
      >
        <span class="relative">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h2l2.4 12.2A1 1 0 0 0 8.4 17H19a1 1 0 0 0 1-1L21.5 8H6" />
            <circle cx="9.5" cy="20" r="1.4" />
            <circle cx="17.5" cy="20" r="1.4" />
          </svg>
          <Transition name="pop">
            <span
              v-if="cart.count > 0"
              class="absolute -end-2 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-neon-green px-1 text-[10px] font-black text-vapor-950 shadow-neon-green"
            >
              {{ toFa(cart.count) }}
            </span>
          </Transition>
        </span>
        سبد خرید
      </button>

      <!-- پروفایل -->
      <NuxtLink
        to="/profile"
        class="flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[10px] font-bold transition"
        :class="isActive('/profile') ? 'text-neon-purple' : 'text-zinc-400'"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path stroke-linecap="round" d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
        </svg>
        پروفایل
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const cart = useCartStore()
const assistantOpen = useState<boolean>('assistantOpen', () => false)
const cartOpen = useState<boolean>('cartOpen', () => false)

/** در صفحه جزئیات محصول مخفی می‌شود (چون اکشن‌بار خودش را دارد) */
const hidden = computed(() => /^\/products\/.+/.test(route.path))

const isActive = (path: string) =>
  path === '/' ? route.path === '/' : route.path.startsWith(path)

const toFa = (n: number): string => n.toLocaleString('fa-IR')
</script>
