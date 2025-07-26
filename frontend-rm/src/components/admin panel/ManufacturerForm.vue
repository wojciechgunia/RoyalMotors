<script setup lang="ts">
import { reactive, defineProps, watch, onMounted, ref } from 'vue'
import { useAdminPanelStore } from '@/stores/adminpanel.ts'
import type { Manufacturer } from '@/types/adminpanel.ts'
import type { FormKitNode } from '@formkit/core'
import { initFlowbite } from 'flowbite'

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
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-xl w-full p-6 relative">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {{ isEdit ? 'Edit Manufacturer' : 'Add Manufacturer' }}
      </h2>

      <FormKit
        type="form"
        :submit-label="isEdit ? 'Update Manufacturer' : 'Create Manufacturer'"
        @submit="submit"
      >
        <FormKit type="text" name="code" label="Manufacturer Code" v-model="form.code" />

        <FormKit type="text" name="name" label="Name" v-model="form.name" />

        <FormKit type="text" name="logo_url" label="Logo URL" v-model="form.logo_url" />
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

<style scoped lang="scss"></style>
