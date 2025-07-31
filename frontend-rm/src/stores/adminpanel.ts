import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LaravelResponseCollection } from '@/types'
import type { Car, Manufacturer, File } from '@/types/adminpanel.ts'
import axiosInstance from '@/lib/axios.ts'
import type { FormKitNode } from '@formkit/core'
import router from '@/router'
import { AxiosError } from 'axios'

export const useAdminPanelStore = defineStore('adminPanel', () => {
  const manufacturersCollection = ref<Manufacturer[] | null>(null)
  const carsCollection = ref<LaravelResponseCollection<Car> | null>(null)
  const filesCollection = ref<LaravelResponseCollection<File> | null>(null)
  const isLoading = ref<boolean>(false)

  const getManufacturers = async () => {
    try {
      isLoading.value = true
      const data = await axiosInstance.get(`/manufacturers`)
      manufacturersCollection.value = await data.data
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
      await getManufacturers()
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
      await getManufacturers()
      return true
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 422) {
        node?.setErrors([], e.response?.data.errors)
      }
      isLoading.value = false
      return false
    }
  }

  const deleteManufacturer = async (code: string) => {
    try {
      isLoading.value = true
      await axiosInstance.delete(`/manufacturers/${code}`)
      await getManufacturers()
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  const getCars = async (page: number) => {
    try {
      isLoading.value = true
      const { data } = await axiosInstance.get(`/manufacturers/cars?page=${page}`)
      carsCollection.value = await data
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  const createCar = async (payload: Car, node?: FormKitNode) => {
    try {
      isLoading.value = true
      await axiosInstance.post('/manufacturers/cars', payload)
      isLoading.value = false
      await getCars(1)
      return true
    } catch (e) {
      console.log(e)
      if (e instanceof AxiosError && e.response?.status === 422) {
        node?.setErrors([], e.response?.data.errors)
      }
      isLoading.value = false
      return false
    }
  }

  const editCar = async (uuid: string, payload: Car, node?: FormKitNode) => {
    try {
      isLoading.value = true
      await axiosInstance.put(`/manufacturers/cars/${uuid}`, payload)
      isLoading.value = false
      await getCars(1)
      return true
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 422) {
        node?.setErrors([], e.response?.data.errors)
      }
      isLoading.value = false
      return false
    }
  }

  const deleteCar = async (uuid: string, page: number) => {
    try {
      isLoading.value = true
      await axiosInstance.delete(`/manufacturers/cars/${uuid}`)
      await getCars(page)
      while (carsCollection.value?.data.length === 0 && page > 1) {
        page--
        await getCars(page)
      }
      await router.push({ name: 'posts', query: { page: page } })
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  const getFiles = async (page: number, category?: string) => {
    try {
      isLoading.value = true
      if (category) {
        const { data } = await axiosInstance.get(`/file?page=${page}&category=${category}`)
        filesCollection.value = await data
      } else {
        const { data } = await axiosInstance.get(`/file?page=${page}`)
        filesCollection.value = await data
      }
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  const createFiles = async (payload: undefined, category: string, node?: FormKitNode) => {
    try {
      isLoading.value = true
      await axiosInstance.post('/file', payload)
      isLoading.value = false
      if (filesCollection.value) await getFiles(filesCollection.value.current_page, category)
      return true
    } catch (e) {
      console.log(e)
      if (e instanceof AxiosError && e.response?.status === 422) {
        node?.setErrors([], e.response?.data.errors)
      }
      isLoading.value = false
      return false
    }
  }

  return {
    manufacturersCollection,
    carsCollection,
    filesCollection,
    isLoading,
    getManufacturers,
    createManufacturer,
    editManufacturer,
    deleteManufacturer,
    getCars,
    createCar,
    editCar,
    deleteCar,
    getFiles,
    createFiles,
  }
})
