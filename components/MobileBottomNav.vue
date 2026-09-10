<template>
  <nav
    v-if="!hidden"
    class="md:hidden fixed inset-x-0 bottom-0 z-[60] mx-auto w-full max-w-lg px-3 pb-[max(env(safe-area-inset-bottom),0.6rem)]"
  >
    <div
      class="glass-strong relative flex items-end justify-between rounded-3xl px-2 pb-2 pt-2 shadow-glass border border-white/[0.15]"
    >
      <!-- خانه -->
      <NuxtLink
        to="/"
        class="flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[10px] font-extrabold transition duration-200"
        :class="isActive('/') ? 'text-neon-purple font-black' : 'text-zinc-400 hover:text-zinc-200'"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 10.5L12 3l9 7.5V21H3z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 21v-6h6v6" />
        </svg>
        خانه
      </NuxtLink>

      <!-- فروشگاه -->
      <NuxtLink
        to="/products"
        class="flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[10px] font-extrabold transition duration-200"
        :class="isActive('/products') ? 'text-neon-purple font-black' : 'text-zinc-400 hover:text-zinc-200'"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        فروشگاه
      </NuxtLink>

      <!-- دکمه برجسته مرکزی دستیار AI -->
      <div class="relative -top-5 flex flex-1 flex-col items-center">
        <button
          class="flex h-14 w-14 animate-pulse-glow items-center justify-center rounded-full bg-gradient-to-br from-neon-violet via-neon-purple to-neon-ice text-2xl text-white shadow-neon-purple transition-transform active:scale-90"
          aria-label="دستیار هوشمند طعم"
          @click="assistantOpen = true"
        >
          ✨
        </button>
        <span class="mt-0.5 text-[10px] font-black text-neon-purple">ساملیه AI</span>
      </div>

      <!-- سبد خرید -->
      <button
        class="relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[10px] font-extrabold text-zinc-400 hover:text-zinc-200 transition duration-200"
        @click="cartOpen = true"
      >
        <span class="relative">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h2l2.4 12.2A1 1 0 0 0 8.4 17H19a1 1 0 0 0 1-1L21.5 8H6" />
            <circle cx="9.5" cy="20" r="1.4" />
            <circle cx="17.5" cy="20" r="1.4" />
          </svg>
          <Transition name="pop">
            <span
              v-if="cart.count > 0"
              class="absolute -end-2 -top-1.5 flex h-4 min-w-[1.1rem] items-center justify-center rounded-full bg-neon-green px-1 text-[9px] font-black text-vapor-950 shadow-neon-green"
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
        class="flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[10px] font-extrabold transition duration-200"
        :class="isActive('/profile') ? 'text-neon-purple font-black' : 'text-zinc-400 hover:text-zinc-200'"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
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

/** در صفحه جزئیات محصول مخفی می‌شود (چون اکشن‌بار خرید اختصاصی دارد) */
const hidden = computed(() => /^\/products\/.+/.test(route.path))

const isActive = (path: string) =>
  path === '/' ? route.path === '/' : route.path.startsWith(path)

const toFa = (n: number): string => n.toLocaleString('fa-IR')
</script>
