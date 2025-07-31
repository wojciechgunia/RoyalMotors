<script setup lang="ts">
defineProps<{
  mode: 'left' | 'scroll' | 'none'
}>()
</script>

<template>
  <div class="relative w-5 h-8 border-2 border-current rounded-full mx-auto">
    <!-- Left click -->
    <template v-if="mode === 'left'">
      <div class="absolute left-0 top-0 w-1/2 h-1/2 rounded-tl-full bg-current opacity-80" />
      <div
        class="absolute right-0 top-0 w-[45%] h-1/2 rounded-tr-full bg-transparent border-[#ffffffaa] border-solid border-[1px] opacity-80"
      />
    </template>
    <!-- Scroll -->
    <div
      v-else-if="mode === 'scroll'"
      class="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 rounded bg-current opacity-90"
    />
    <div
      class="absolute left-0 bottom-0 w-full h-[45%] border-[#ffffffaa] rounded-b-full bg-current opacity-70"
      style="border-top: 2px solid white"
    />
  </div>
</template>

<style scoped lang="scss"></style>
