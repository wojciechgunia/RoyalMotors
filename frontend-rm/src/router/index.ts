import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminPanelView from '@/views/admin/AdminPanelView.vue'
import LoginView from '@/views/admin/auth/LoginView.vue'
import RegisterView from '@/views/admin/auth/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/admin',
      name: 'admin-panel',
      component: AdminPanelView,
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: LoginView,
    },
    {
      path: '/admin/register',
      name: 'admin-register',
      component: RegisterView,
    },
  ],
})

export default router
