<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'CSE 185 Technical Demo',
  meta: [
    { name: 'description', content: 'Vite Starter Template' },
  ],
  script: [
    { src: 'https://cdn.jsdelivr.net/npm/hls.js@latest' },
  ],
})
</script>

<template>
  <router-view />
</template>
