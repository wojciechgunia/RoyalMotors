<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'

const props = defineProps<{ path: string }>()

const { scene } = await useGLTF(props.path)
</script>

<template>
  <primitive :object="scene" :scale="15" :rotation="[0, Math.PI / 3, 0]" />
</template>

<style scoped lang="scss"></style>
