<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const services = [
  {
    name: 'Financing',
    href: '#',
  },
  {
    name: 'Car insurance',
    href: '#',
  },
  {
    name: 'Car rental',
    href: '#',
  },
  {
    name: 'Test drive',
    href: '#',
  },
  {
    name: 'Leasing',
    href: '#',
  },
]

const mobileMenuOpen = ref(false)

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    class="bg-transparent fixed right-0 top-0 z-50 w-[100%]"
    :class="{ 'bg-[#222222]': isScrolled }"
  >
    <nav
      class="mx-auto flex max-w-7xl p-1 items-center justify-between lg:px-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1">
        <a href="#" class="-m-1.5 p-1.5 flex items-center">
          <img class="h-[70px] w-auto" src="/RM-logo.png" alt="" />
          <p class="comp-name pl-3">Royal Motors</p>
        </a>
      </div>
      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-5 mr-4 text-gray-700 dark:text-gray-200"
          @click="mobileMenuOpen = true"
        >
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>
      </div>
      <PopoverGroup class="hidden lg:flex lg:gap-x-14">
        <a href="#" class="text-md/6 font-semibold text-gray-900 dark:text-gray-100 uppercase"
          >Cars</a
        >
        <a href="#" class="text-md/6 font-semibold text-gray-900 dark:text-gray-100 uppercase"
          >Car Service</a
        >
        <Popover class="relative">
          <PopoverButton
            class="flex items-center gap-x-1 text-md/6 font-semibold text-gray-900 dark:text-gray-100 uppercase"
          >
            Services
            <ChevronDownIcon
              class="size-6 flex-none text-gray-400 dark:text-gray-200"
              aria-hidden="true"
            />
          </PopoverButton>

          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
          >
            <PopoverPanel
              class="absolute left-1/2 z-10 mt-3 w-screen max-w-56 -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5"
            >
              <div class="p-4">
                <div
                  v-for="item in services"
                  :key="item.name"
                  class="group relative flex items-center gap-x-4 rounded-lg p-3 text-sm/6 hover:bg-gray-50"
                >
                  <div class="flex-auto">
                    <a :href="item.href" class="block font-semibold text-gray-900">
                      {{ item.name }}
                      <span class="absolute inset-0" />
                    </a>
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>
        <a href="#" class="text-md/6 font-semibold text-gray-900 dark:text-gray-100 uppercase"
          >Contact</a
        >
      </PopoverGroup>
    </nav>
    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-50" />
      <DialogPanel
        class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-[#222222] p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
      >
        <div class="flex items-center justify-between">
          <a href="#" class="-m-1.5 p-1.5 flex items-center">
            <img class="h-[70px] w-auto" src="/RM-logo.png" alt="" />
          </a>
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="size-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <a
                href="#"
                class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-gray-100 uppercase"
                >Cars</a
              >
              <a
                href="#"
                class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-gray-100 uppercase"
                >Car service</a
              >
              <Disclosure as="div" class="-mx-3" v-slot="{ open }">
                <DisclosureButton
                  class="flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-gray-100 uppercase"
                >
                  Services
                  <ChevronDownIcon
                    :class="[open ? 'rotate-180' : '', 'size-5 flex-none']"
                    aria-hidden="true"
                  />
                </DisclosureButton>
                <DisclosurePanel class="mt-2 space-y-2">
                  <DisclosureButton
                    v-for="item in [...services]"
                    :key="item.name"
                    as="a"
                    :href="item.href"
                    class="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-gray-100"
                    >{{ item.name }}</DisclosureButton
                  >
                </DisclosurePanel>
              </Disclosure>
              <a
                href="#"
                class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-gray-100 uppercase"
                >Contact</a
              >
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<style scoped lang="scss">
.comp-name {
  font-family: 'MarveleScript', cursive;
  color: #c89116;
  font-size: 2.1rem;
}
</style>
