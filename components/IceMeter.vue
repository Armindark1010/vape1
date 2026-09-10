<template>
  <div class="flex items-center gap-1" :title="`خنکی: ${level} از ۵`">
    <span
      v-for="i in 5"
      :key="i"
      class="h-3.5 w-1.5 rounded-full transition-all duration-300"
      :class="
        i <= level
          ? 'bg-neon-ice shadow-[0_0_8px_rgba(103,232,249,0.8)]'
          : 'bg-white/10'
      "
      :style="i <= level ? { height: `${10 + i * 3}px` } : {}"
    />
    <span class="ms-1 text-[10px] font-bold text-neon-ice/90">❄ {{ level }}/۵</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ level: number }>(), { level: 0 })
</script>
