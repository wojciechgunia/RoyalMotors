<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'

const path = '/models/scene.gltf'

const { scene } = await useGLTF(path)
</script>

<template>
  <primitive :object="scene" :scale="15" :rotation="[0, Math.PI / 3, 0]" />
</template>

<style scoped lang="scss"></style>
