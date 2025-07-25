<script setup lang="ts">
import router from '@/router'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'

const auth = useAuthStore()
const isRegister = ref<boolean | null>(null)

onMounted(() => {
  const path = router.currentRoute.value.name
  isRegister.value = path === 'admin-register'
})
</script>

<template>
  <div class="mt-[120px] text-white max-w-[1280px] mx-auto">
    <template v-if="isRegister != null && isRegister">
      <h1 class="text-3xl p-4">Register</h1>
      <div
        class="max-w-sm mx-auto bg-white rounded-xl shadow-md dark:bg-gray-800 flex flex-col p-4 space-y-4"
      >
        <FormKit type="form" submit-label="Register" @submit="auth.register">
          <FormKit type="text" label="Name" name="name" />
          <FormKit type="email" label="Email" name="email" placeholder="user@example.com" />
          <FormKit type="password" label="Password" name="password" />
          <FormKit type="password" label="Confirm password" name="password_confirmation" />
        </FormKit>
      </div>
    </template>
    <template v-else-if="isRegister != null">
      <h1 class="text-3xl p-4 mt-[120px]">Login</h1>
      <div
        class="max-w-sm mx-auto bg-white rounded-xl shadow-md dark:bg-gray-800 flex flex-col p-4 space-y-4"
      >
        <FormKit type="form" submit-label="Login" @submit="auth.login">
          <FormKit type="email" label="Email" name="email" placeholder="user@example.com" />
          <FormKit type="password" label="Password" name="password" />
        </FormKit>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
