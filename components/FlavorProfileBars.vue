<template>
  <div class="space-y-3.5">
    <div v-for="b in bars" :key="b.key" class="space-y-1.5">
      <div class="flex items-center justify-between text-xs font-black">
        <span class="flex items-center gap-1.5 text-zinc-200">
          <span class="text-sm">{{ b.icon }}</span>
          <span>{{ b.label }}</span>
        </span>
        <span class="font-black text-sm" :style="{ color: b.color }">
          {{ toFa(animated ? b.value : 0) }}٪
        </span>
      </div>
      <div class="h-2.5 overflow-hidden rounded-full bg-white/10 p-0.5 border border-white/5">
        <div
          class="flavor-bar h-full rounded-full"
          :style="{
            width: (animated ? b.value : 0) + '%',
            background: `linear-gradient(90deg, ${b.color}77, ${b.color})`,
            boxShadow: `0 0 14px ${b.color}99`,
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlavorProfile } from '~/types/product'

const props = defineProps<{ profile: FlavorProfile }>()
const animated = ref(false)

const bars = computed(() => [
  { key: 'sweet', icon: '🍬', label: 'شیرینی طعم', value: props.profile.sweetness, color: '#f472b6' },
  { key: 'cool', icon: '❄️', label: 'خنکی و یخ', value: props.profile.cooling, color: '#38bdf8' },
  { key: 'throat', icon: '🔥', label: 'گیرایی گلو (Throat Hit)', value: props.profile.throatHit, color: '#34d399' },
])

const toFa = (n: number): string => Math.round(n).toLocaleString('fa-IR')

onMounted(() => {
  requestAnimationFrame(() => {
    setTimeout(() => (animated.value = true), 200)
  })
})
</script>
