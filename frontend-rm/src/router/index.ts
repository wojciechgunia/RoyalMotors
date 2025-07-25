import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminPanelView from '@/views/admin/AdminPanelView.vue'
import AuthView from '@/views/admin/auth/AuthView.vue'
import E404View from '@/views/Error/E404View.vue'
import E500View from '@/views/Error/E500View.vue'
import { useAuthStore } from '@/stores/auth.ts'

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
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AuthView,
      meta: { requiresGuest: true },
    },
    {
      path: '/admin/register',
      name: 'admin-register',
      component: AuthView,
      meta: { requiresGuest: true },
    },
    {
      path: '/404',
      name: '404',
      component: E404View,
    },
    {
      path: '/500',
      name: '500',
      component: E500View,
    },
    {
      path: '/:catchAll(.*)',
      name: '404',
      component: E404View,
    },
  ],
})

router.beforeEach((to, _, next) => {
  const auth = useAuthStore()
  if (to.matched.some((record) => record.meta.requiresAuth) && !auth.isLoggedIn) {
    next({
      name: 'admin-login',
    })
  } else if (to.matched.some((record) => record.meta.requiresGuest) && auth.isLoggedIn) {
    next({
      name: 'admin-panel',
    })
  } else {
    next()
  }
})

export default router
