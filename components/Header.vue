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

            <!-- Right Side: Show Cart & User Info When Logged In -->
            <div class="flex items-center space-x-4">
              <!-- Cart Button (Always Visible) -->
              <nuxt-link v-if="isAuthenticated"
                class="bg-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-800 transition"
                to="/">
                <img src="/icons/cart_fill_yellow.svg" alt="cart icon" class="w-7 h-7" />
              </nuxt-link>

              <!-- User Profile Dropdown (When Logged In) -->
              <div v-if="isAuthenticated" class="relative">
                <div @click="toggleDropdown" class="flex items-center cursor-pointer space-x-2">
                  <div class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300">
                    <i class="bi bi-person text-2xl text-gray-700"></i> <!-- Placeholder Avatar -->
                  </div>
                  <span class="text-gray-800 font-semibold">{{ user?.first_name }} {{ user?.last_name }}</span>
                </div>

                <!-- Dropdown Menu -->
                <div v-if="dropdownOpen"
                  class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 border border-gray-200 z-50">
                  <NuxtLink to="/profile" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Hồ sơ</NuxtLink>
                  <NuxtLink to="/settings" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Cài đặt</NuxtLink>
                  <hr />
                  <button @click="logout"
                    class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                    Đăng xuất
                  </button>
                </div>
              </div>

              <!-- Show Login Button When Not Logged In -->
              <nuxt-link v-else to="/login"
                class="bg-yellow-500 text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-800">
                Login
              </nuxt-link>
            </div>
          </nav>
        </div>
      </header>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Import Pinia store

// Mobile Menu State
const isMenuOpen = ref(false);

// Navigation Menu Items
const menuItems = [
  { label: "Home", path: "/" },
  { label: "Menu", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/" }
];

// Access Auth Store
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

// Profile Dropdown State
const dropdownOpen = ref(false);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Logout Function
const logout = () => {
  authStore.logout();
  dropdownOpen.value = false; // Close dropdown on logout
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
