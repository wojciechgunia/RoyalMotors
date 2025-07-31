<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InfoRow',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
})
</script>

<template>
  <div class="flex justify-between text-sm">
    <span class="font-medium text-gray-200">{{ label }}:</span>
    <span class="text-gray-300 text-right">{{ value }}</span>
  </div>
</template>

<style scoped lang="scss"></style>
