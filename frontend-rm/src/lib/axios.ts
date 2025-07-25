import axios from 'axios'
import router from '../router'
import { useAuthStore } from '@/stores/auth.ts'
import { useToast } from 'vue-toast-notification'

const axiosInstance = axios.create({
  withCredentials: true,
  withXSRFToken: true,
  baseURL: 'http://localhost:8000/api/v1',
})

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const auth = useAuthStore()
    const $toast = useToast()
    switch (error.response?.status) {
      case 401:
        auth.cleanState()
        $toast.error('Unauthorized')
        await router.push('/login')
        break

      case 404:
        $toast.error('Source Not Found')
        await router.push('/404')
        break

      case 419:
        auth.cleanState()
        $toast.error('Unauthorized')
        await router.push('/login')
        break

      case 500:
        $toast.error('Internal Server Error')
        await router.push('/500')
        break
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
