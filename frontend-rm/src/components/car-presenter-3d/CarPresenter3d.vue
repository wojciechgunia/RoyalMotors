<script setup lang="ts">
import CarModel from './CarModel.vue'
import { TresCanvas } from '@tresjs/core'
import CustomControls from '@/components/car-presenter-3d/CustomControls.vue'
</script>

<template>
  <TresCanvas shadows class="w-full h-full canvas-background">
    <TresPerspectiveCamera
      :position="[40, 80, 280]"
      :fov="45"
      :near="1"
      :far="1000"
      :look-at="[0, 100, 0]"
    />

    <TresAmbientLight :intensity="0.3" />
    <TresDirectionalLight :position="[-20, 80, 10]" :intensity="1" />
    <TresDirectionalLight :position="[20, 80, 10]" :intensity="1" />
    <TresDirectionalLight :position="[-20, 80, -50]" :intensity="1" />
    <TresDirectionalLight :position="[20, 80, -50]" :intensity="1" />

    <CustomControls />
    <Suspense>
      <CarModel />
    </Suspense>
  </TresCanvas>
</template>

<style scoped lang="scss">
.canvas-background {
  background-image: url('/salon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
