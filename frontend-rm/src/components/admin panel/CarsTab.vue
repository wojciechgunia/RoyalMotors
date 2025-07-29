<script setup lang="ts">
import { useAdminPanelStore } from '@/stores/adminpanel.ts'
import type { Car } from '@/types/adminpanel.ts'
import { onMounted, ref } from 'vue'
import CarForm from '@/components/admin panel/CarForm.vue'
import { initFlowbite } from 'flowbite'
const adminPanelStore = useAdminPanelStore()

onMounted(() => {
  adminPanelStore.getCars(1)
  initFlowbite()
})

const isEdit = ref<boolean>(false)
const isEdited = ref<Car | null>(null)
const isCreate = ref<boolean>(false)

const editCar = async (payload: Car) => {
  isEdit.value = true
  isEdited.value = payload
}

console.log(adminPanelStore.carsCollection)
</script>

<template>
  <div class="flex justify-between items-start">
    <h1 class="text-3xl text-white">Cars</h1>
    <button
      type="button"
      class="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      @click="isCreate = true"
    >
      Create
    </button>
    <template v-if="isCreate">
      <CarForm :is-edit="false" :show-modal="isCreate" @hideModal="isCreate = false" />
    </template>
  </div>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Model</th>
          <th scope="col" class="px-6 py-3">Year of prod.</th>
          <th scope="col" class="px-6 py-3">Version</th>
          <th scope="col" class="px-6 py-3">Color</th>
          <th scope="col" class="px-6 py-3">Min. price</th>
          <th scope="col" class="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <template
          v-if="adminPanelStore.carsCollection && adminPanelStore.carsCollection.data.length > 0"
        >
          <tr
            v-for="Car in adminPanelStore.carsCollection.data"
            v-bind:key="Car.uuid"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ Car.model }}
            </th>
            <td class="px-6 py-4">{{ Car.year_of_manufacture }}</td>
            <td class="px-6 py-4">{{ Car.version }}</td>
            <td class="px-6 py-4">{{ Car.color }}</td>
            <td class="px-6 py-4">{{ Car.min_price }} €</td>

            <td class="px-6 py-4">
              <button
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                @click="editCar(Car)"
              >
                Edit
              </button>
            </td>
          </tr>
        </template>
        <template v-if="isEdit && isEdited">
          <CarForm
            :is-edit="true"
            :show-modal="isEdit"
            :model-value="isEdited"
            @hideModal="isEdit = false"
          />
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss"></style>
