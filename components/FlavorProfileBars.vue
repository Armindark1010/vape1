<template>
  <div class="space-y-3">
    <div v-for="b in bars" :key="b.key">
      <div class="mb-1 flex items-center justify-between text-xs font-bold">
        <span class="flex items-center gap-1.5 text-zinc-300">
          <span>{{ b.icon }}</span> {{ b.label }}
        </span>
        <span :style="{ color: b.color }">{{ toFa(animated ? b.value : 0) }}٪</span>
      </div>
      <div class="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div
          class="flavor-bar h-full rounded-full"
          :style="{
            width: (animated ? b.value : 0) + '%',
            background: `linear-gradient(90deg, ${b.color}55, ${b.color})`,
            boxShadow: `0 0 12px ${b.color}88`,
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
  { key: 'sweet', icon: '🍬', label: 'شیرینی', value: props.profile.sweetness, color: '#f472b6' },
  { key: 'cool', icon: '❄️', label: 'خنکی / یخ', value: props.profile.cooling, color: '#67e8f9' },
  { key: 'throat', icon: '🔥', label: 'گیرایی گلو', value: props.profile.throatHit, color: '#34d399' },
])

const toFa = (n: number): string => Math.round(n).toLocaleString('fa-IR')

onMounted(() => {
  requestAnimationFrame(() => {
    setTimeout(() => (animated.value = true), 250)
  })
})
</script>
