<script setup lang="ts">
import { useAdminPanelStore } from '@/stores/adminpanel.ts'
import type { Manufacturer } from '@/types/adminpanel.ts'
import { onMounted, ref } from 'vue'
import ManufacturerForm from '@/components/admin panel/ManufacturerForm.vue'
import { initFlowbite } from 'flowbite'
const adminPanelStore = useAdminPanelStore()

onMounted(() => {
  adminPanelStore.getManufacturers()
  initFlowbite()
})

const isEdit = ref<boolean>(false)
const isEdited = ref<Manufacturer | null>(null)
const isCreate = ref<boolean>(false)

const editManufacturer = async (payload: Manufacturer) => {
  isEdit.value = true
  isEdited.value = payload
}
</script>

<template>
  <div class="flex justify-between items-start">
    <h1 class="text-3xl text-white">Manufacturers</h1>
    <button
      type="button"
      class="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      @click="isCreate = true"
    >
      Create
    </button>
    <template v-if="isCreate">
      <ManufacturerForm :is-edit="false" :show-modal="isCreate" @hideModal="isCreate = false" />
    </template>
  </div>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3">Code</th>
          <th scope="col" class="px-6 py-3">Logo</th>
          <th scope="col" class="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <template
          v-if="
            adminPanelStore.manufacturersCollection &&
            adminPanelStore.manufacturersCollection.length > 0
          "
        >
          <tr
            v-for="manufacturer in adminPanelStore.manufacturersCollection"
            v-bind:key="manufacturer.code"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ manufacturer.name }}
            </th>
            <td class="px-6 py-4">{{ manufacturer.code }}</td>
            <td class="px-6 py-4">
              <img
                :src="manufacturer.logo_url"
                alt="logo"
                style="max-height: 40px; max-width: 100px"
              />
            </td>
            <td class="px-6 py-4">
              <button
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                @click="editManufacturer(manufacturer)"
              >
                Edit
              </button>
            </td>
          </tr>
        </template>
        <template v-if="isEdit && isEdited">
          <ManufacturerForm
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
