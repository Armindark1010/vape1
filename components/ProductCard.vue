<template>
  <NuxtLink
    :to="`/products/${product.id}`"
    v-motion
    :initial="{ opacity: 0, y: 28 }"
    :visible-once="{ opacity: 1, y: 0, transition: { delay: (index % 4) * 70, duration: 500 } }"
    class="glass group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:border-neon-purple/50 hover:shadow-neon-purple"
  >
    <!-- تصویر -->
    <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-neon-purple/15 via-transparent to-neon-ice/15">
      <img
        :src="product.images[0]"
        :alt="product.name"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:rotate-1 group-hover:scale-110"
      />
      <div class="absolute start-2 top-2 flex flex-col gap-1">
        <span
          v-for="b in product.badges"
          :key="b"
          class="rounded-full bg-vapor-950/70 px-2 py-0.5 text-[10px] font-extrabold text-neon-green backdrop-blur-md"
        >
          {{ b }}
        </span>
        <span
          v-if="discount"
          class="rounded-full bg-neon-pink/90 px-2 py-0.5 text-[10px] font-black text-white"
        >
          ٪{{ toFa(discount) }} تخفیف
        </span>
      </div>
      <button
        class="absolute end-2 top-2 rounded-full bg-vapor-950/60 p-1.5 backdrop-blur-md transition active:scale-90"
        :class="liked ? 'text-neon-pink' : 'text-zinc-400'"
        aria-label="علاقه‌مندی"
        @click.prevent="liked = !liked"
      >
        <svg class="h-4 w-4" :fill="liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.4 5 5.8 5c2 0 3.4 1.1 4.2 2.3h4C14.8 6.1 16.2 5 18.2 5c3.4 0 5.4 3.6 3.8 6.7C19.5 16.3 12 21 12 21z" transform="scale(0.95)" />
        </svg>
      </button>
    </div>

    <!-- اطلاعات -->
    <div class="flex flex-1 flex-col gap-1.5 p-3">
      <p class="text-[10px] font-bold text-zinc-500">{{ product.brand }} • {{ categoryLabel(product.category) }}</p>
      <h3 class="truncate text-[13px] font-extrabold leading-5">{{ product.name }}</h3>

      <div class="flex items-center justify-between">
        <div class="flex -space-x-1.5 space-x-reverse">
          <span
            v-for="f in product.flavors.slice(0, 4)"
            :key="f.id"
            class="flex h-5 w-5 items-center justify-center rounded-full border border-vapor-950 text-[11px]"
            :style="{ background: f.color + '33' }"
            :title="f.name"
          >
            {{ f.icon }}
          </span>
        </div>
        <span class="text-[10px] font-bold text-zinc-400">⭐ {{ toFa(product.rating) }}</span>
      </div>

      <IceMeter :level="Math.round(product.profile.cooling / 20)" />

      <div class="mt-auto flex items-end justify-between pt-1">
        <div>
          <p v-if="product.oldPrice" class="text-[10px] text-zinc-500 line-through">
            {{ formatPrice(product.oldPrice) }}
          </p>
          <p class="text-sm font-black text-neon-green">{{ formatPrice(product.price) }}</p>
        </div>
        <button
          class="rounded-xl bg-gradient-to-l from-neon-purple to-neon-blue px-3 py-2 text-xs font-extrabold text-white shadow-neon-purple transition active:scale-90"
          aria-label="افزودن به سبد"
          @click.prevent="quickAdd"
        >
          ＋ سبد
        </button>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'
import { categoryLabel, formatPrice } from '~/types/product'
import { useCartStore } from '~/stores/cart'

const props = withDefaults(defineProps<{ product: Product; index?: number }>(), { index: 0 })
const cart = useCartStore()
const liked = ref(false)

const discount = computed(() =>
  props.product.oldPrice
    ? Math.round(((props.product.oldPrice - props.product.price) / props.product.oldPrice) * 100)
    : 0,
)

const toFa = (n: number): string =>
  n.toLocaleString('fa-IR', { maximumFractionDigits: 1 })

function quickAdd() {
  const p = props.product
  cart.add(p.id, p.flavors[0]?.id, p.nicotine.includes(0) ? undefined : p.nicotine[0], 1)
}
</script>
