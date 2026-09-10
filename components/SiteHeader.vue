<template>
  <header class="glass-strong sticky top-0 z-50 border-x-0 border-t-0">
    <div class="mx-auto flex w-full max-w-md items-center gap-2 px-4 py-3">
      <NuxtLink to="/" class="flex flex-1 items-center gap-2.5">
        <span
          class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple via-neon-violet to-neon-blue text-xl shadow-neon-purple"
        >
          💨
        </span>
        <span class="leading-tight">
          <span class="neon-text-purple block text-base font-black">لوکس ویپ</span>
          <span class="block text-[10px] font-bold text-zinc-500">VAPE • SALT • POD</span>
        </span>
      </NuxtLink>

      <NuxtLink
        to="/search"
        class="rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 text-zinc-300 transition active:scale-90"
        aria-label="جستجو"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path stroke-linecap="round" d="M16.5 16.5L21 21" />
        </svg>
      </NuxtLink>

      <button
        class="relative rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 text-zinc-300 transition active:scale-90"
        aria-label="سبد خرید"
        @click="cartOpen = true"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h2l2.4 12.2A1 1 0 0 0 8.4 17H19a1 1 0 0 0 1-1L21.5 8H6" />
          <circle cx="9.5" cy="20" r="1.4" />
          <circle cx="17.5" cy="20" r="1.4" />
        </svg>
        <Transition name="pop">
          <span
            v-if="cart.count > 0"
            class="absolute -end-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-neon-green px-1 text-[10px] font-black text-vapor-950 shadow-neon-green"
          >
            {{ cart.count.toLocaleString('fa-IR') }}
          </span>
        </Transition>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()
const cartOpen = useState<boolean>('cartOpen', () => false)
</script>
