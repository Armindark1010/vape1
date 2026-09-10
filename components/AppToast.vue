<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed inset-x-0 bottom-28 z-[80] mx-auto flex w-full max-w-md flex-col items-center gap-2 px-6">
      <TransitionGroup name="toast">
        <div
          v-for="t in cart.toasts"
          :key="t.id"
          class="glass-strong flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold text-white shadow-neon-green"
        >
          <span class="flex h-6 w-6 items-center justify-center rounded-full bg-neon-green/20">✓</span>
          {{ t.text }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()
</script>
