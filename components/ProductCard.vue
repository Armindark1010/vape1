<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 24 }"
    :visible-once="{ opacity: 1, y: 0, transition: { delay: (index % 4) * 60, duration: 400 } }"
    class="glass-card group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.12] bg-[#0d0d14]/90 hover:border-neon-purple/60 hover:shadow-neon-purple transition-all duration-300"
  >
    <!-- لینک به صفحه محصول برای بخش تصویر و عنوان -->
    <NuxtLink :to="`/products/${product.id}`" class="relative flex flex-col flex-1">
      <!-- ظرف تصویر محصول -->
      <div class="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-white/[0.04] via-[#14141e] to-neon-purple/[0.08] p-4 flex items-center justify-center">
        <!-- هاله نوری در هاور -->
        <div class="absolute inset-0 bg-gradient-to-tr from-neon-purple/20 via-transparent to-neon-ice/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <img
          :src="product.images[0]"
          :alt="product.name"
          loading="lazy"
          class="relative h-full w-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1"
        />

        <!-- بج‌های وضعیت (پرفروش، تخفیف، جدید) -->
        <div class="absolute start-2.5 top-2.5 flex flex-col gap-1 z-10">
          <span
            v-for="b in product.badges"
            :key="b"
            class="rounded-full border border-neon-green/40 bg-neon-green/15 px-2.5 py-0.5 text-[10px] font-black text-neon-green backdrop-blur-md shadow-sm"
          >
            {{ b }}
          </span>
          <span
            v-if="discount"
            class="rounded-full border border-neon-pink/40 bg-neon-pink/90 px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm"
          >
            ٪{{ toFa(discount) }} تخفیف
          </span>
        </div>

        <!-- دکمه علاقه‌مندی -->
        <button
          class="absolute end-2.5 top-2.5 z-10 rounded-full border border-white/10 bg-[#070709]/70 p-2 backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-90"
          :class="liked ? 'text-neon-pink border-neon-pink/40' : 'text-zinc-400 hover:text-white'"
          aria-label="علاقه‌مندی"
          @click.prevent.stop="liked = !liked"
        >
          <svg class="h-4 w-4" :fill="liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.4 5 5.8 5c2 0 3.4 1.1 4.2 2.3h4C14.8 6.1 16.2 5 18.2 5c3.4 0 5.4 3.6 3.8 6.7C19.5 16.3 12 21 12 21z" transform="scale(0.95)" />
          </svg>
        </button>
      </div>

      <!-- اطلاعات متنی محصول -->
      <div class="flex flex-1 flex-col gap-2 p-3.5 sm:p-4">
        <!-- برند و دسته‌بندی -->
        <div class="flex items-center justify-between text-[11px] font-bold text-zinc-400">
          <span>{{ product.brand }}</span>
          <span class="rounded-lg bg-white/[0.05] px-2 py-0.5 text-[10px] text-zinc-300">{{ categoryLabel(product.category) }}</span>
        </div>

        <!-- نام محصول -->
        <h3 class="line-clamp-1 text-sm font-black text-white leading-snug group-hover:text-neon-purple transition-colors">
          {{ product.name }}
        </h3>

        <!-- دانه‌های طعم و امتیاز -->
        <div class="flex items-center justify-between pt-0.5">
          <div class="flex -space-x-1.5 space-x-reverse">
            <span
              v-for="f in product.flavors.slice(0, 4)"
              :key="f.id"
              class="flex h-5 w-5 items-center justify-center rounded-full border border-[#0d0d14] text-[11px] shadow-sm"
              :style="{ background: f.color + '40', color: '#fff' }"
              :title="f.name"
            >
              {{ f.icon }}
            </span>
          </div>
          <div class="flex items-center gap-1 text-[11px] font-black text-amber-400">
            <span>⭐</span>
            <span>{{ toFa(product.rating) }}</span>
            <span class="text-[10px] font-normal text-zinc-400">({{ toFa(product.reviews) }})</span>
          </div>
        </div>

        <!-- شاخص خنکی / یخ -->
        <div class="pt-0.5">
          <IceMeter :level="Math.round(product.profile.cooling / 20)" />
        </div>
      </div>
    </NuxtLink>

    <!-- بخش قیمت و دکمه خرید سریع -->
    <div class="mt-auto flex items-end justify-between border-t border-white/[0.08] bg-black/20 p-3.5 sm:p-4 pt-3">
      <div>
        <p v-if="product.oldPrice" class="text-[11px] font-medium text-zinc-400 line-through">
          {{ formatPrice(product.oldPrice) }}
        </p>
        <p class="text-sm sm:text-base font-black text-neon-green tracking-tight">
          {{ formatPrice(product.price) }}
        </p>
      </div>

      <button
        class="inline-flex items-center justify-center gap-1 rounded-xl px-3.5 py-2 text-xs font-black text-white transition-all duration-200 active:scale-90"
        :class="added ? 'bg-neon-green text-vapor-950 shadow-neon-green' : 'bg-gradient-to-l from-neon-violet to-neon-purple hover:shadow-neon-purple'"
        aria-label="افزودن به سبد خرید"
        @click.prevent="quickAdd"
      >
        <span v-if="!added">＋ خرید</span>
        <span v-else>✓ شد</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'
import { categoryLabel, formatPrice } from '~/types/product'
import { useCartStore } from '~/stores/cart'

const props = withDefaults(defineProps<{ product: Product; index?: number }>(), { index: 0 })
const cart = useCartStore()
const liked = ref(false)
const added = ref(false)

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
  added.value = true
  setTimeout(() => (added.value = false), 1400)
}
</script>
