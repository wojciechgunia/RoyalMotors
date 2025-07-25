import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoginForm, RegisterForm, User } from '@/types/auth.ts'
import type { FormKitNode } from '@formkit/core'
import axiosInstance from '@/lib/axios.ts'
import router from '@/router'
import { AxiosError } from 'axios'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const isLoggedIn = ref<boolean>(false)

    const cleanState = () => {
      user.value = null
      isLoggedIn.value = false
    }

    const register = async (data: RegisterForm, node?: FormKitNode) => {
      try {
        await axiosInstance.get('/sanctum/csrf-cookie', { baseURL: 'http://localhost:8000' })
        await axiosInstance.post('/register', data)
        await getUser()
        await router.push('/admin')
      } catch (e) {
        if (e instanceof AxiosError && e.response?.status === 422) {
          node?.setErrors([], e.response?.data.errors)
        }
      }
    }

    const login = async (data: LoginForm, node?: FormKitNode) => {
      try {
        await axiosInstance.get('/sanctum/csrf-cookie', { baseURL: 'http://localhost:8000' })
        await axiosInstance.post('/login', data)
        await getUser()
        await router.push('/admin')
      } catch (e) {
        if (e instanceof AxiosError && e.response?.status === 422) {
          node?.setErrors([], e.response?.data.errors)
        }
      }
    }

    const getUser = async () => {
      try {
        const response = await axiosInstance.get('/user')
        user.value = response.data
        isLoggedIn.value = true
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        await router.push('/admin/login')
      }
    }

    const logout = async () => {
      try {
        await axiosInstance.post('/logout')
        user.value = null
        isLoggedIn.value = false
        await router.push('/admin/login')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        user.value = null
        isLoggedIn.value = false
      }
    }

    return {
      user,
      isLoggedIn,
      register,
      login,
      getUser,
      logout,
      cleanState,
    }
  },
  {
    persist: {
      storage: sessionStorage,
      pick: ['user', 'isLoggedIn'],
    },
  },
)
