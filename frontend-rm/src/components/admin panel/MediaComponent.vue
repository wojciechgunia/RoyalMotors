<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue'
import { initFlowbite } from 'flowbite'
import { useAdminPanelStore } from '@/stores/adminpanel.ts'
import type { File as FileType } from '@/types/adminpanel.ts'
import type { FormKitNode } from '@formkit/core'

const props = defineProps({
  select: Boolean,
  tab: String,
})

const emit = defineEmits(['selected'])

const activeTab = ref<string>('pictures')
if (props.tab) {
  activeTab.value = props.tab
}
const selectedFile = ref<string | null>(null)
const dragging = ref(false)

const showForm = ref(false)
const uploadFile = ref<File | null>(null)

const page = ref(1)

const fileStore = useAdminPanelStore()
const { getFiles, createFiles } = fileStore

onMounted(() => {
  initFlowbite()
  fetchFiles()
})

watch([page, activeTab], () => {
  fetchFiles()
})

function fetchFiles() {
  getFiles(page.value, activeTab.value)
}

function handleTabChange(tab: string) {
  activeTab.value = tab
  page.value = 1
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    uploadFile.value = file
    showForm.value = true
  }
}

function handleFileInput(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    uploadFile.value = file
    showForm.value = true
  }
}

function selectFile(file: FileType) {
  if (props.select) {
    selectedFile.value = file.filename
  } else if (file.category === 'pictures') {
    window.open(file.uuid, '_blank')
  }
}

function confirmSelect(file: string) {
  emit('selected', 'http://localhost:8000/api/v1/file/' + file)
}

const getCategory = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (!ext) return 'document'

  if (['jpg', 'jpeg', 'png'].includes(ext)) return 'pictures'
  if (['zip', 'glb', 'gltf', 'fbx', 'obj'].includes(ext)) return '3dmodels'
  return 'documents'
}

const tabs = ['pictures', '3dmodels', 'documents']

const submitForm = async (payload: any, node?: FormKitNode) => {
  if (!uploadFile.value) return

  const category = getCategory(uploadFile.value.name)
  const formData = new FormData()
  formData.append('file', uploadFile.value)
  formData.append('filename', payload.filename)
  formData.append('category', category)

  const success = await createFiles(formData, node, activeTab.value)
  if (success) {
    uploadFile.value = null
    showForm.value = false
  }
}
</script>

<template>
  <div class="w-full">
    <!-- Tabs -->
    <div class="mb-4 flex space-x-2">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="handleTabChange(tab)"
        type="button"
        :class="[
          'px-4 py-2 rounded-t capitalize',
          activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200',
        ]"
      >
        {{ tab == '3dmodels' ? '3D Models' : tab }}
      </button>
    </div>

    <!-- Grid -->
    <div
      class="grid grid-cols-4 gap-4 p-2 min-h-[250px]"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop="handleDrop"
    >
      <!-- File Tiles -->
      <template v-if="fileStore.filesCollection && fileStore.filesCollection.data.length > 0">
        <div
          v-for="file in fileStore.filesCollection.data"
          :key="file.uuid"
          class="relative border rounded shadow-sm hover:shadow-md cursor-pointer"
          :class="{ 'ring-4 ring-blue-500': selectedFile === file.filename }"
          @click="selectFile(file)"
        >
          <img
            v-if="file.category === 'pictures'"
            :src="'http://localhost:8000/api/v1/file/' + file.filename"
            :alt="file.filename.split('/')[1]"
            class="h-full object-cover rounded-t"
          />
          <div
            v-else
            class="flex items-center justify-center w-full h-[250px] text-5xl text-gray-400"
          >
            <i v-if="file.category === '3dmodels'" class="fas fa-cube"></i>
            <i v-else class="fas fa-file-alt"></i>
          </div>
          <div class="text-center text-md font-bold p-1 truncate text-gray-600 mt-[-35px]">
            {{ file.filename.split('.')[0].split('/')[1] }}
          </div>
        </div>
      </template>

      <!-- Add File Card -->
      <div
        class="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 min-h-[250px] rounded cursor-pointer hover:bg-gray-50 p-2 relative"
        @click="$refs.fileInput.click()"
      >
        <i class="fas fa-plus text-3xl text-gray-500"></i>
        <span class="text-xs mt-1 text-gray-500">Dodaj plik</span>
        <input type="file" ref="fileInput" class="hidden" @change="handleFileInput" />

        <!-- FormKit Form -->
        <div
          v-if="showForm && uploadFile"
          class="absolute top-0 left-0 w-full h-full bg-white bg-opacity-95 p-3 rounded"
          @click.stop
        >
          <FormKit type="form" :actions="false" submit-label="Dodaj" @submit="submitForm">
            <FormKit
              type="text"
              name="filename"
              label="Nazwa pliku"
              :value="uploadFile.name.split('.')[0]"
              validation="required"
            />

            <div class="flex justify-end mt-4 space-x-2">
              <button
                type="button"
                class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
                @click.stop="
                  () => {
                    showForm = false
                    uploadFile = null
                  }
                "
              >
                Anuluj
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Dodaj
              </button>
            </div>
          </FormKit>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="fileStore.filesCollection" class="flex justify-center mt-4">
      <nav>
        <ul class="inline-flex items-center -space-x-px">
          <li>
            <button
              class="px-3 py-1 border rounded-l hover:bg-gray-100"
              :disabled="fileStore.filesCollection.current_page === 1"
              @click="page--"
            >
              Prev
            </button>
          </li>
          <li class="px-3 py-1 text-sm border-t border-b">
            {{ fileStore.filesCollection.current_page }} / {{ fileStore.filesCollection.last_page }}
          </li>
          <li>
            <button
              class="px-3 py-1 border rounded-r hover:bg-gray-100"
              :disabled="
                fileStore.filesCollection.current_page === fileStore.filesCollection.last_page
              "
              @click="page++"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
    <div v-if="props.select" class="flex justify-end items-center mt-4 w-full">
      <button
        class="mt-1 text-sm text-white bg-blue-600 px-3 py-2 rounded"
        type="button"
        @click="confirmSelect(selectedFile)"
        :disabled="!selectedFile"
      >
        Wybierz
      </button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
</style>
