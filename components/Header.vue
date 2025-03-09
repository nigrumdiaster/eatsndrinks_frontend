<template>
  <div class="sub_page">
    <div class="hero_area">
      <!-- Header Section -->
      <header class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="flex justify-between items-center py-4">
            <!-- Logo -->
            <nuxt-link to="/" class="text-3xl font-bold text-yellow-500">EATSNDRINKS</nuxt-link>

            <!-- Mobile Menu Button -->
            <button @click="isMenuOpen = !isMenuOpen" class="md:hidden text-gray-700 focus:outline-none">
              <i class="bi bi-list text-2xl"></i>
            </button>

            <!-- Navigation Links -->
            <ul :class="['md:flex md:items-center md:space-x-6', isMenuOpen ? 'block' : 'hidden']"
              class="absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 rounded-lg">
              <li v-for="(item, index) in menuItems" :key="index"
                class="py-2 md:py-0 px-4 md:px-0 font-semibold text-lg text-gray-800 hover:text-yellow-500">
                <NuxtLink :to="item.path">{{ item.label }}</NuxtLink>
              </li>
            </ul>

            <!-- Cart & Login Placeholder -->
            <div class="flex items-center space-x-4">
              <nuxt-link
                class="bg-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-800 transition"
                to="/">
                <img src="/icons/cart_fill_yellow.svg" alt="cart icon" class="w-7 h-7" />
              </nuxt-link>
              <nuxt-link to="/login"
                class="bg-yellow-500 text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-800">Login</nuxt-link>
            </div>
          </nav>
        </div>
      </header>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const menuItems = [
  { label: "Home", path: "/" },
  { label: "Menu", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/" }
];
</script>
