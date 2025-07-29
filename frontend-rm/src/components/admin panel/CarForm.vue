<script setup lang="ts">
import { reactive, defineProps, watch, onMounted, ref } from 'vue'
import { useAdminPanelStore } from '@/stores/adminpanel'
import { initFlowbite } from 'flowbite'
import { type FormKitNode } from '@formkit/core'
import type { Car } from '@/types/adminpanel.ts'
import MediaComponent from '@/components/admin panel/MediaComponent.vue'

const { createCar, editCar, manufacturersCollection } = useAdminPanelStore()

onMounted(() => {
  initFlowbite()
})

const props = defineProps({
  isEdit: Boolean,
  modelValue: Object,
  showModal: Boolean,
})

const show = ref(false)
const showMediaPic = ref(false)
const showMedia3d = ref(false)

const emits = defineEmits(['hideModal'])

const closeModal = () => {
  show.value = false
  emits('hideModal')
}

const form = reactive<Car>({
  uuid: '',
  model: '',
  manufacturer_code: '',
  year_of_manufacture: '',
  version: '',
  type_of_vehicle: '',
  color: '',
  min_price: '',
  engine: '',
  power: '',
  transmission: '',
  fuel: '',
  number_of_doors: '5',
  number_of_seats: '5',
  other_info: '',
  image_url: '',
  '3d_model_url': '',
})

watch(
  () => props.modelValue,
  (val) => {
    if (props.isEdit && val) {
      Object.assign(form, val)
      form.manufacturer_code = val.manufacturer.code
    }
    show.value = props.showModal
  },
  { immediate: true },
)

const submit = async (payload: Car, node?: FormKitNode) => {
  let close = false
  if (props.isEdit) {
    close = await editCar(props.modelValue?.uuid, form, node)
  } else {
    close = await createCar(form, node)
  }
  if (close) closeModal()
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-xl w-full p-6 relative max-h-[90vh] overflow-y-hidden"
    >
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {{ isEdit ? 'Edit Car' : 'Add Car' }}
      </h2>

      <FormKit type="form" id="carForm" :actions="false" @submit="submit">
        <FormKit type="multi-step" tab-style="progress">
          <!-- Step 1: Basic Info -->
          <FormKit type="step" name="basic" step="1" title="Basic Info">
            <div class="max-h-[60vh] overflow-y-auto p-2">
              <FormKit type="text" name="model" label="Model" v-model="form.model" />
              <FormKit
                type="select"
                name="manufacturer_code"
                label="Manufacturer"
                v-model="form.manufacturer_code"
                :options="[
                  { label: 'Select manufacturer', value: '' },
                  ...manufacturersCollection?.map((m) => ({ label: m.name, value: m.code })),
                ]"
              />
              <FormKit
                type="text"
                name="year_of_manufacture"
                label="Year of Manufacture"
                v-model="form.year_of_manufacture"
              />
              <FormKit type="text" name="version" label="Version" v-model="form.version" />
              <FormKit type="text" name="color" label="Color" v-model="form.color" />
              <FormKit
                type="number"
                name="min_price"
                label="Minimum Price"
                v-model="form.min_price"
              />
            </div>
          </FormKit>

          <!-- Step 2: Details -->
          <FormKit type="step" name="details" step="2" title="Details">
            <div class="max-h-[60vh] overflow-y-auto p-2 flex">
              <div class="w-50% pr-3">
                <FormKit
                  type="text"
                  name="type_of_vehicle"
                  label="Body Type"
                  v-model="form.type_of_vehicle"
                />
                <FormKit type="text" name="engine" label="Engine" v-model="form.engine" />
                <FormKit
                  type="text"
                  name="number_of_doors"
                  label="Number of Doors"
                  v-model="form.number_of_doors"
                />
                <FormKit type="text" name="fuel" label="Fuel Type" v-model="form.fuel" />
              </div>
              <div class="w-50%">
                <FormKit
                  type="text"
                  name="transmission"
                  label="Transmission"
                  v-model="form.transmission"
                />
                <FormKit type="text" name="power" label="Power" v-model="form.power" />
                <FormKit
                  type="text"
                  name="number_of_seats"
                  label="Number of Seats"
                  v-model="form.number_of_seats"
                />
                <FormKit
                  type="textarea"
                  name="other_info"
                  label="Other Info"
                  v-model="form.other_info"
                />
              </div>
            </div>
          </FormKit>

          <!-- Step 3: Media -->
          <FormKit type="step" name="media" step="3" title="Media">
            <div class="max-h-[60vh] overflow-y-auto p-2 mb-5">
              <FormKit
                type="text"
                name="image_url"
                label="Thumbnail URL (jpg/png)"
                validation="url"
                v-model="form.image_url"
              />
              <button
                type="button"
                @click="showMediaPic = true"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Add picture
              </button>
              <div
                v-if="showMediaPic"
                class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                style="z-index: 200"
              >
                <div
                  class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-[1280px] w-full p-6 relative"
                >
                  <button
                    @click="showMediaPic = false"
                    class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
                    aria-label="Close"
                    style="z-index: 210"
                    type="button"
                  >
                    &times;
                  </button>
                  <MediaComponent
                    :select="true"
                    :tab="'pictures'"
                    @selected="
                      (url: string) => {
                        form.image_url = url
                        showMediaPic = false
                      }
                    "
                  ></MediaComponent>
                </div>
              </div>
              <FormKit
                type="text"
                name="3d_model_url"
                label="3D Model URL"
                validation="url"
                v-model="form['3d_model_url']"
              />
              <button
                type="button"
                @click="showMedia3d = true"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Add 3D model
              </button>
              <div
                v-if="showMedia3d"
                class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                style="z-index: 200"
              >
                <div
                  class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-[1280px] w-full p-6 relative"
                >
                  <button
                    @click="showMedia3d = false"
                    class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
                    aria-label="Close"
                    style="z-index: 210"
                    type="button"
                  >
                    &times;
                  </button>
                  <MediaComponent
                    :select="true"
                    :tab="'3dmodels'"
                    @selected="
                      (url: string) => {
                        form['3d_model_url'] = url
                        showMedia3d = false
                      }
                    "
                  ></MediaComponent>
                </div>
              </div>
            </div>
            <template #stepNext>
              <FormKit type="submit" :label="isEdit ? 'Update Car' : 'Create Car'" />
            </template>
          </FormKit>
        </FormKit>
      </FormKit>

      <button
        @click="closeModal"
        class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  </div>
</template>

<style scoped></style>
