import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LaravelResponseCollection } from '@/types'
import type { Car } from '@/types/cars.ts'
import axiosInstance from '@/lib/axios.ts'

export const useCarsStore = defineStore('cars', () => {
  const carsCollection = ref<LaravelResponseCollection<Car> | null>(null)
  const isLoading = ref<boolean>(false)

  const getCars = async (page: number) => {
    try {
      isLoading.value = true
      const { data } = await axiosInstance.get(`/manufacturers/cars?page=${page}&per_page=4`)
      console.log(data)
      carsCollection.value = await data
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    carsCollection,
    isLoading,
    getCars,
  }
})
