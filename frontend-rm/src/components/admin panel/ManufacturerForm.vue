<script setup lang="ts">
import { reactive, defineProps, watch, onMounted, ref } from 'vue'
import { useAdminPanelStore } from '@/stores/adminpanel.ts'
import type { Manufacturer } from '@/types/adminpanel.ts'
import type { FormKitNode } from '@formkit/core'
import { initFlowbite } from 'flowbite'
import MediaComponent from '@/components/admin panel/MediaComponent.vue'

const { createManufacturer, editManufacturer } = useAdminPanelStore()

onMounted(() => {
  initFlowbite()
})

const props = defineProps({
  isEdit: Boolean,
  modelValue: Object,
  showModal: Boolean,
})

const show = ref(false)
const showMedia = ref(false)

const emits = defineEmits(['hideModal'])

const closeModal = () => {
  show.value = false
  emits('hideModal')
}

const form = reactive({
  code: '',
  name: '',
  logo_url: '',
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (props.isEdit && newVal) {
      Object.assign(form, newVal)
    }
    show.value = props.showModal
  },
  { immediate: true },
)

const submit = async (payload: Manufacturer, node?: FormKitNode) => {
  let close: boolean
  if (props.isEdit) {
    close = await editManufacturer(props.modelValue?.code, payload, node)
  } else {
    close = await createManufacturer(payload, node)
  }
  if (close) {
    closeModal()
  }
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    style="z-index: 100"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full p-6 relative">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {{ isEdit ? 'Edit Manufacturer' : 'Add Manufacturer' }}
      </h2>

      <button
        @click="closeModal"
        class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
        style="z-index: 110"
        aria-label="Close"
      >
        &times;
      </button>

      <FormKit
        type="form"
        :submit-label="isEdit ? 'Update Manufacturer' : 'Create Manufacturer'"
        @submit="submit"
      >
        <FormKit type="text" name="code" label="Manufacturer Code" v-model="form.code" />

        <FormKit type="text" name="name" label="Name" v-model="form.name" />

        <FormKit type="text" name="logo_url" label="Logo URL" v-model="form.logo_url" />
        <button
          type="button"
          @click="showMedia = true"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-1 mb-7 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Add picture
        </button>
        <div
          v-if="showMedia"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          style="z-index: 200"
        >
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-[1280px] w-full p-6 relative"
          >
            <button
              @click="showMedia = false"
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
                  form.logo_url = url
                  showMedia = false
                }
              "
            ></MediaComponent>
          </div>
        </div>
      </FormKit>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
