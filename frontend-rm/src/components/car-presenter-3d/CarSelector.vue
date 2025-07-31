<script setup lang="ts">
import { defineEmits, onMounted, ref } from 'vue'
import { useCarsStore } from '@/stores/cars.ts'

const carsStore = useCarsStore()

const emit = defineEmits(['selected'])

const page = ref<number>(1)

function scrollUp() {
  if (page.value > 0) carsStore.getCars(page.value - 1).then(() => page.value--)
}

function scrollDown() {
  if (carsStore.carsCollection && page.value < carsStore.carsCollection.last_page)
    carsStore.getCars(page.value + 1).then(() => page.value++)
}

onMounted(() => {
  carsStore.getCars(page.value).then(() => {
    emit('selected', carsStore.carsCollection?.data[0])
  })
})
</script>

<template>
  <div
    class="w-[270px] absolute right-[20px] top-0 h-max-[100vh] mt-[100px] mb-[10px] flex flex-col justify-center"
  >
    <!-- Scroll Up Button -->
    <button
      class="top-0 z-10 bg-black/50 text-white p-1 rounded-full hover:bg-black h-[32px]"
      @click="scrollUp"
      v-if="page > 1"
    >
      ▲
    </button>
    <span v-else class="h-[32px]"></span>

    <div class="space-y-3 py-5">
      <template v-if="carsStore.carsCollection && carsStore.carsCollection.data.length > 0">
        <div
          v-for="car in carsStore.carsCollection.data"
          :key="car.uuid"
          class="relative aspect-video border-[3px] border-[#c89116] rounded overflow-hidden cursor-pointer"
          @click="emit('selected', car)"
        >
          <img :src="car.image_url" alt="Car" class="w-full h-full object-cover" />
          <div
            class="absolute top-0 left-0 bg-black/40 text-white px-2 py-1 text-sm rounded flex items-center gap-2"
          >
            <img
              :src="car.manufacturer?.logo_url"
              alt="Logo"
              class="h-4 w-auto opacity-80"
              style="filter: drop-shadow(2px 2px 4px white)"
            />
          </div>
          <div
            class="absolute bottom-0 right-0 bg-black/40 text-white px-2 py-1 text-md rounded flex items-center gap-2"
            style="font-weight: 500"
          >
            <span>{{ car.model }}</span>
          </div>
        </div>
      </template>
    </div>

    <!-- Scroll Down Button -->
    <button
      class="bg-black/50 text-white p-1 rounded-full hover:bg-black h-[32px]"
      @click="scrollDown"
      v-if="carsStore.carsCollection && carsStore.carsCollection.last_page > page"
    >
      ▼
    </button>
    <span v-else class="h-[32px]"></span>
  </div>
</template>

<style scoped lang="scss"></style>
