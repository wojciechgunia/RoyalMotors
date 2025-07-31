<script setup lang="ts">
import {
  ArrowPathIcon,
  ArrowPathRoundedSquareIcon,
  ArrowsPointingOutIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/solid'
import MouseIcon from '@/components/car-presenter-3d/MouseIcon.vue'

defineEmits(['reset'])
</script>

<template>
  <div class="absolute bg-[#222222BF] p-1 flex items-center bottom-2 right-5 rounded-md">
    <div class="flex gap-6 text-sm text-gray-300 items-center ml-2 mr-5">
      <div class="flex items-center gap-2 text-2xl items-center">
        <MouseIcon mode="left" />
        <p class="mb-1">+</p>
        <ArrowsPointingOutIcon class="size-7"></ArrowsPointingOutIcon>
        <p class="mb-1">→</p>
        <ArrowPathRoundedSquareIcon class="size-7"></ArrowPathRoundedSquareIcon>
      </div>
      <div class="flex items-center gap-2 text-2xl items-center">
        <MouseIcon mode="left" />
        <p class="mb-1">+</p>
        <MouseIcon mode="scroll" />
        <p class="mb-1">→</p>
        <MagnifyingGlassIcon class="size-8"></MagnifyingGlassIcon>
      </div>
    </div>

    <button
      @click="$emit('reset')"
      class="flex text-sm items-center gap-2 bg-[#222222BF] text-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-800 transition"
    >
      <ArrowPathIcon class="size-5"></ArrowPathIcon>
      Reset view
    </button>
  </div>
</template>

<style scoped lang="scss"></style>
