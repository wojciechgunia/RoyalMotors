<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
const auth = useAuthStore()
</script>

<template>
  <div class="mt-[120px] text-white max-w-[1280px] mx-auto">
    <h1 class="text-3xl">Dashboard</h1>
    <div class="flex justify-between">
      <div>
        <p class="text-lg">Welcome back {{ auth.user?.name }}</p>
        <p class="text-sm">{{ auth.user?.email }}</p>
      </div>
      <button
        type="button"
        class="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        @click="auth.logout"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
