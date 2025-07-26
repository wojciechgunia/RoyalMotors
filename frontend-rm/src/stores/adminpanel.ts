import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LaravelResponseCollection } from '@/types'
import type { Manufacturer } from '@/types/adminpanel.ts'
import axiosInstance from '@/lib/axios.ts'
import type { FormKitNode } from '@formkit/core'
import router from '@/router'
import { AxiosError } from 'axios'

export const useAdminPanelStore = defineStore('adminPanel', () => {
  const manufacturersCollection = ref<LaravelResponseCollection<Manufacturer> | null>(null)
  const isLoading = ref<boolean>(false)

  const getManufacturers = async (page: number) => {
    try {
      isLoading.value = true
      const { data } = await axiosInstance.get(`/manufacturers?page=${page}`)
      manufacturersCollection.value = await data
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  const createManufacturer = async (payload: Manufacturer, node?: FormKitNode) => {
    try {
      isLoading.value = true
      await axiosInstance.post('/manufacturers', payload)
      isLoading.value = false
      await getManufacturers(1)
      return true
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 422) {
        node?.setErrors([], e.response?.data.errors)
      }
      isLoading.value = false
      return false
    }
  }

  const editManufacturer = async (code: string, payload: Manufacturer, node?: FormKitNode) => {
    try {
      isLoading.value = true
      await axiosInstance.put(`/manufacturers/${code}`, payload)
      isLoading.value = false
      await getManufacturers(1)
      return true
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 422) {
        node?.setErrors([], e.response?.data.errors)
      }
      isLoading.value = false
      return false
    }
  }

  const deleteManufacturer = async (code: string, page: number) => {
    try {
      isLoading.value = true
      await axiosInstance.delete(`/manufacturers/${code}`)
      await getManufacturers(page)
      while (manufacturersCollection.value?.data.length === 0 && page > 1) {
        page--
        await getManufacturers(page)
      }
      await router.push({ name: 'posts', query: { page: page } })
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    manufacturersCollection,
    isLoading,
    getManufacturers,
    createManufacturer,
    editManufacturer,
    deleteManufacturer,
  }
})
