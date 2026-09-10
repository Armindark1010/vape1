<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title) =>
    title && !title.includes('لوکس ویپ') ? `${title} | لوکس ویپ` : title || 'لوکس ویپ',
})
</script>
