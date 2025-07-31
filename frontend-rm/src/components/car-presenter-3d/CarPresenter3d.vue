<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import CustomControls from '@/components/car-presenter-3d/CustomControls.vue'
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { initFlowbite } from 'flowbite'
import type { Car } from '@/types/cars.ts'
import CarSelector from '@/components/car-presenter-3d/CarSelector.vue'
import CarDetails from '@/components/car-presenter-3d/CarDetails.vue'
import Controls3D from '@/components/car-presenter-3d/3DControls.vue'
const CarModel = defineAsyncComponent(() => import('./CarModel.vue'))

const selectedCar = ref<Car>({
  uuid: '',
  model: '',
  year_of_manufacture: '',
  version: '',
  type_of_vehicle: '',
  color: '',
  engine: '',
  power: '',
  transmission: '',
  fuel: '',
  number_of_doors: '',
  number_of_seats: '',
  other_info: '',
  image_url: '',
  '3d_model_url': '',
  min_price: '',
  manufacturer: null,
})

onMounted(() => {
  initFlowbite()
})
const sceneRef = ref<{ resetOrbit: () => void }>()

function handleReset() {
  sceneRef.value?.resetOrbit()
}
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

    <CustomControls ref="sceneRef" />
    <Suspense :key="selectedCar['3d_model_url']">
      <template #default>
        <CarModel :path="selectedCar['3d_model_url']" />
      </template>
    </Suspense>
  </TresCanvas>
  <CarSelector
    @selected="
      (value: Car) => {
        selectedCar = value
      }
    "
  ></CarSelector>
  <CarDetails :car="selectedCar"></CarDetails>
  <Controls3D @reset="handleReset"></Controls3D>
</template>

<style scoped lang="scss">
.canvas-background {
  background-image: url('/salon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
