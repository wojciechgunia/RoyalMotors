<script setup lang="ts">
import { defineProps } from 'vue'
import type { Car } from '@/types/cars.ts'
import InfoRow from '@/components/car-presenter-3d/InfoRow.vue'

defineProps<{
  car: Car
}>()

function formatPrice(value: string | number): string {
  const number = Number(value)
  if (isNaN(number)) return '—'
  return (
    new Intl.NumberFormat('cz-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number) + ' €'
  )
}
</script>

<template>
  <div
    class="border-[3px] border-[#c89116] rounded-2xl bg-[#222222BF] space-y-4 w-[320px] absolute left-[20px] top-0 h-max-[100vh] mt-[100px] p-5"
  >
    <div class="flex items-center space-x-4">
      <template v-if="car.manufacturer">
        <img
          :src="car.manufacturer.logo_url"
          alt="Logo"
          class="h-7 w-auto"
          style="filter: drop-shadow(2px 2px 4px white)"
        />
      </template>
      <h2 class="text-xl font-bold text-gray-100">
        {{ car.model }} <br /><span class="text-gray-400">({{ car.version }})</span>
      </h2>
    </div>

    <!-- Informacje ogólne -->
    <section class="p-2">
      <h3 class="text-md text-gray-100 font-semibold border-b pb-1 mb-2">General information</h3>
      <div class="grid grid-cols-1 gap-4">
        <InfoRow label="Year of production" :value="car.year_of_manufacture" />
        <InfoRow label="Vehicle type" :value="car.type_of_vehicle" />
        <InfoRow label="Color" :value="car.color" />
        <template v-if="car.manufacturer">
          <InfoRow label="Manufacturer" :value="car.manufacturer?.name" />
        </template>
      </div>
    </section>

    <!-- Specyfikacja techniczna -->
    <section class="p-2">
      <h3 class="text-md text-gray-100 font-semibold border-b pb-1 mb-2">
        Technical specifications
      </h3>
      <div class="grid grid-cols-1 gap-4">
        <InfoRow label="Engine" :value="car.engine" />
        <InfoRow label="Power" :value="car.power" />
        <InfoRow label="Transmission type" :value="car.transmission" />
        <InfoRow label="Fuel" :value="car.fuel" />
        <InfoRow label="Number of doors" :value="car.number_of_doors" />
        <InfoRow label="Number of seats" :value="car.number_of_seats" />
      </div>
    </section>

    <!-- Inne dane -->
    <section class="p-2">
      <h3 class="text-md text-gray-100 font-semibold border-b pb-1 mb-2">Other info</h3>
      <div class="grid grid-cols-1 gap-4">
        <InfoRow label="Minimal price" :value="formatPrice(car.min_price)" />
        <InfoRow label="Other info" :value="car.other_info" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss"></style>
