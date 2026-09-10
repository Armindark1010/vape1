<template>
  <div class="flex items-center gap-1.5" :title="`میزان خنکی: ${level} از ۵`">
    <div class="flex items-end gap-1">
      <span
        v-for="i in 5"
        :key="i"
        class="w-1.5 rounded-full transition-all duration-300"
        :class="
          i <= level
            ? 'bg-neon-ice shadow-[0_0_8px_rgba(56,189,248,0.9)]'
            : 'bg-white/15'
        "
        :style="{ height: `${8 + i * 2.5}px` }"
      />
    </div>
    <span class="ms-1 text-[11px] font-black text-neon-ice">
      ❄️ {{ level }}/۵
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ level: number }>(), { level: 0 })
</script>
